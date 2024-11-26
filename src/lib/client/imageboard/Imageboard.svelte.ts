import { getContext, setContext } from "svelte";
import { Board } from "./Board.svelte";
import { Thread } from "./Thread.svelte";
import type { posts_new } from "@prisma/client";

export class Imageboard {
  boards: Map<number, Board> = $state(new Map());
  activeBoard: Board | null = $state(null);
  activeThread: Thread | null = $state(null);

  constructor() {
    const initialBoards = [
      { id: 1, name: 'void' },
      { id: 2, name: 'seams' },
      { id: 3, name: 'adventures' }
    ];

    // Initialize each board
    initialBoards.forEach(({ id, name }) => {
      this.createBoard(id, name);
    });
  }

  createBoard(id: number, name: string) {
    // Check for duplicate board
    if (this.boards.has(id)) {
      return;
    }

    const board = new Board({ id, name });
    this.boards.set(id, board);
    return board;
  }

  getBoard(boardId: number | null): Board | null {
    if (!boardId) {
      return null;
    }
    return this.boards.get(boardId) || null;
  }

  setActiveBoard(boardId: number | null) {
    const board = this.getBoard(boardId);
    this.activeBoard = board;
    this.activeThread = null;
  }

  setActiveThread(threadId: number) {
    if (!this.activeBoard) {
      throw new Error('No active board selected');
    }

    const thread = this.activeBoard.getThread(threadId);
    if (!thread) {
      throw new Error(`Thread with id ${threadId} not found on active board`);
    }

    this.activeThread = thread;
  }

  // adds posts to respective boards/threads
  async addPosts(posts: posts_new[]) {
    console.log('adding posts');
    // Early return if no posts
    if (!posts.length) return;

    // Separate parents and children in a single pass
    const parentPosts: posts_new[] = [];
    const childrenByParentId = new Map<number, posts_new[]>();

    for (const post of posts) {
      if (post.parent_id === null) {
        parentPosts.push(post);
      } else if (post.parent_id) {
        const children = childrenByParentId.get(post.parent_id) || [];
        children.push(post);
        childrenByParentId.set(post.parent_id, children);
      }
    }

    // Process parent posts first - create new threads
    for (const parentPost of parentPosts) {
      const boardId = parentPost.board_id;
      const board = this.boards.get(boardId);

      if (!board) {
        console.warn(`Board ${boardId} not found for post ${parentPost.id}`);
        continue;
      }

      const thread = new Thread(parentPost);

      // Add any children found for this parent
      const children = childrenByParentId.get(parentPost.id);
      if (children?.length) {
        thread.children = children;
      }

      // Add thread to board
      try {
        board.addThread(thread, 'front');
      } catch (e) {
        console.warn(`Failed to add thread ${parentPost.id} to board ${boardId}:`, e);
      }
    }

    // Process remaining children posts that belong to existing threads
    for (const [parentId, children] of childrenByParentId) {
      // Skip children we've already handled with new threads
      if (parentPosts.some(p => p.id === parentId)) continue;

      // Find existing thread for these children
      const boardId = children[0].board_id;
      const board = this.boards.get(boardId);
      if (!board) continue;

      const thread = board.getThread(parentId);
      if (!thread) {
        console.warn(`Thread ${parentId} not found for children posts`);
        continue;
      }

      // Add children to existing thread
      thread.children = [...thread.children, ...children];
    }
  }

  get totalThreads() {
    let total = $derived([...this.boards.values()].reduce(
      (sum, board) => sum + board.threads.length,
      0
    ));

    return total;
  }
}

const IMAGEBOARD_CTX = 'IMAGEBOARD_CTX';

export function setImageboardState() {
  const imageboardState = new Imageboard();
  setContext(IMAGEBOARD_CTX, imageboardState);
  return imageboardState;
}

export function getImageboardState() {
  return getContext<Imageboard>(IMAGEBOARD_CTX);
}
