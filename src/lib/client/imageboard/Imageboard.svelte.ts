import { getContext, setContext } from "svelte";
import { Board } from "./Board.svelte";
import type { Thread } from "./Thread.svelte";

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
      throw new Error(`Board with id ${id} already exists`);
    }

    const board = new Board({ id, name });
    this.boards.set(id, board);
    return board;
  }

  getBoard(boardId: number): Board | null {
    return this.boards.get(boardId) || null;
  }

  setActiveBoard(boardId: number) {
    const board = this.getBoard(boardId);
    if (!board) {
      throw new Error(`Board with id ${boardId} not found`);
    }
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

  get totalThreads() {
    return $derived([...this.boards.values()].reduce(
      (sum, board) => sum + board.threads.length,
      0
    ));
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
