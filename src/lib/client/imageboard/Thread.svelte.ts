import type { posts_new } from "@prisma/client";

export interface ThreadProps {
  parent: posts_new;
  children: posts_new[];
  locked: boolean;
}

export class Thread implements ThreadProps {
  parent: posts_new;
  children: posts_new[] = $state([]);
  locked: boolean = $state(false);
  latestActivity: number = $state(0);

  constructor(parent: posts_new, data: Partial<Omit<Thread, 'parent'>> = {}) {
    this.parent = parent;
    Object.assign(this, data);
    this.updateLatestActivity();
  }

  addChild(child: posts_new) {
    this.children = [...this.children, child];
    this.updateLatestActivity();
  }

  private updateLatestActivity() {
    const getTimestamp = (date: Date | null): number => {
      if (!date) return 0;
      return new Date(date).getTime();
    };

    const timestamps = [
      getTimestamp(this.parent.latest_activity ?? this.parent.created_at),
      ...this.children.map(child =>
        getTimestamp(child.latest_activity ?? child.created_at)
      )
    ];

    this.latestActivity = Math.max(...timestamps);
  }
}
