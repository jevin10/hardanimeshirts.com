import type { Thread } from "./Thread.svelte";

export class Board {
  id: number = 0;
  name: string = '';
  threads: Thread[] = $state([]);

  constructor(data: Partial<Board> = {}) {
    Object.assign(this, data);
  }

  // Helper to get latest activity timestamp for a thread
  private getThreadLastActivity(thread: Thread): number {
    const getTimestamp = (date: Date | null): number => {
      if (!date) return 0;
      return new Date(date).getTime();
    };

    // Use latest_activity if available, otherwise fall back to created_at
    const parentActivity = getTimestamp(thread.parent.latest_activity ?? thread.parent.created_at);

    const childrenActivity = thread.children.map(child =>
      getTimestamp(child.latest_activity ?? child.created_at)
    );

    return Math.max(parentActivity, ...childrenActivity);
  }

  // adds a thread to the board array
  addThread(thread: Thread) {
    if (this.threads.some(t => t.parent.id === thread.parent.id)) {
      return;
    }

    const insertIndex = this.threads.findIndex(existing =>
      thread.latestActivity > existing.latestActivity
    );

    if (insertIndex === -1) {
      this.threads = [...this.threads, thread];
    } else {
      this.threads = [
        ...this.threads.slice(0, insertIndex),
        thread,
        ...this.threads.slice(insertIndex)
      ];
    }
  }

  getThread(threadId: number): Thread | undefined {
    return this.threads.find(t => t.parent.id === threadId);
  }
}
