import type { boards } from "@prisma/client";
import type { Thread } from "./Thread.svelte";

export class Board {
  id: number = 0;
  name: string = '';
  threads: Thread[] = $state([]);

  constructor(data: Partial<Board> = {}) {
    Object.assign(this, data);
  }

  // adds a thread to the board array
  addThread(thread: Thread, position: 'front' | 'back') {
    // Check for duplicate based on thread parent id
    if (this.threads.some(t => t.parent.id === thread.parent.id)) {
      throw new Error(`Thread with id ${thread.parent.id} already exists on this board`);
    }

    switch (position) {
      case 'front':
        this.threads = [thread, ...this.threads];
        break;
      case 'back':
        this.threads = [...this.threads, thread];
        break;
    }
  }

  getThread(threadId: number) {
    return this.threads.find(t => t.parent.id === threadId);
  }
}
