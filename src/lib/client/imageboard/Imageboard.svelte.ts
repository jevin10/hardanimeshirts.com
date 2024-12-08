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
    if (this.boards.has(id)) return;
    const board = new Board({ id, name });
    this.boards.set(id, board);
    return board;
  }

  getBoard(boardId: number | null): Board | null {
    if (!boardId) return null;
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

  /**
   * Filters and adds new unique posts to allPosts array
   */
  private addUniquePostsToStore(newPosts: posts_new[]): posts_new[] {
    const existingPostIds = new Set(this.allPosts.map(p => p.id));
    const uniquePosts = newPosts.filter(post => !existingPostIds.has(post.id));

    if (uniquePosts.length) {
      this.allPosts = [...this.allPosts, ...uniquePosts].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
    }

    return uniquePosts;
  }

  /**
   * Separates posts into parent posts and children posts
   */
  private separateParentAndChildPosts(posts: posts_new[]): {
    parentPosts: posts_new[],
    childrenByParentId: Map<number, posts_new[]>
  } {
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

    return { parentPosts, childrenByParentId };
  }

  /**
   * Processes parent posts by creating new threads and adding them to boards
   */
  private processParentPosts(
    parentPosts: posts_new[],
    childrenByParentId: Map<number, posts_new[]>
  ) {
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
  }

  /**
   * Processes child posts by adding them to existing threads
   */
  private processChildPosts(
    childrenByParentId: Map<number, posts_new[]>,
    parentPosts: posts_new[]
  ) {
    for (const [parentId, children] of childrenByParentId) {
      // Skip if we already processed these children with their parent
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
  }

  /**
   * Main method to add new posts to the imageboard
   */
  async addPosts(posts: posts_new[]) {
    try {
      console.log('adding posts:', JSON.stringify(posts));
      if (!posts.length) return;
      console.log('this ran');

      // Step 1: Add unique posts to the store
      const uniquePosts = this.addUniquePostsToStore(posts);
      if (!uniquePosts.length) return;

      // Step 2: Separate posts into parents and children
      const { parentPosts, childrenByParentId } = this.separateParentAndChildPosts(uniquePosts);

      // Step 3: Process parent posts (create new threads)
      this.processParentPosts(parentPosts, childrenByParentId);

      // Step 4: Process remaining child posts (add to existing threads)
      this.processChildPosts(childrenByParentId, parentPosts);

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
