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
      return;
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

  getThread(threadId: number): Thread | undefined {
    return this.threads.find(t => t.parent.id === threadId);
  }
}
