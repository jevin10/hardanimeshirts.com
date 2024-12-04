import { getContext, setContext } from "svelte";
import { Board } from "./Board.svelte";
import { Thread } from "./Thread.svelte";
import type { posts_new } from "@prisma/client";

export class Imageboard {
  boards: Map<number, Board> = $state(new Map());
  activeBoard: Board | null = $state(null);
  activeThread: Thread | null = $state(null);
  allPosts: posts_new[] = $state([]);

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

  getPosts(): posts_new[] {
    return this.allPosts;
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
    try {
      console.log('[addPosts]');
      if (!posts.length) return;

      try {
        this.allPosts = [...this.allPosts, ...posts].sort((a, b) => {
          // Convert string dates to Date objects before comparing
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
      } catch (error) {
        console.error('Error sorting posts:', error);
        throw error;
      }

      // Separate parents and children
      const parentPosts: posts_new[] = [];
      const childrenByParentId = new Map<number, posts_new[]>();

      try {
        for (const post of posts) {
          if (post.parent_id === null) {
            parentPosts.push(post);
          } else if (post.parent_id) {
            const children = childrenByParentId.get(post.parent_id) || [];
            children.push(post);
            childrenByParentId.set(post.parent_id, children);
          }
        }
      } catch (error) {
        console.error('Error separating posts:', error);
        throw error;
      }

      // Process parent posts
      try {
        for (const parentPost of parentPosts) {
          const boardId = parentPost.board_id;
          const board = this.boards.get(boardId);
          if (!board) {
            console.warn(`Board ${boardId} not found for post ${parentPost.id}`);
            continue;
          }

          const thread = new Thread(parentPost);
          const children = childrenByParentId.get(parentPost.id);
          if (children?.length) {
            thread.children = children;
          }

          try {
            board.addThread(thread);
          } catch (e) {
            console.error(`Failed to add thread ${parentPost.id} to board ${boardId}:`, e);
            throw e;
          }
        }
      } catch (error) {
        console.error('Error processing parent posts:', error);
        throw error;
      }

      // Process children posts
      try {
        for (const [parentId, children] of childrenByParentId) {
          if (parentPosts.some(p => p.id === parentId)) continue;

          const boardId = children[0].board_id;
          const board = this.boards.get(boardId);
          if (!board) continue;

          const thread = board.getThread(parentId);
          if (!thread) {
            console.warn(`Thread ${parentId} not found for children posts`);
            continue;
          }

          thread.children = [...thread.children, ...children];
        }
      } catch (error) {
        console.error('Error processing child posts:', error);
        throw error;
      }

    } catch (error) {
      console.error('Fatal error in addPosts:', error);
      throw error;
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
