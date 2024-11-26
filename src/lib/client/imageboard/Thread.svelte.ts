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

  constructor(parent: posts_new, data: Partial<Omit<Thread, 'parent'>> = {}) {
    this.parent = parent;
    Object.assign(this, data);
  }

  addChild(child: posts_new) {
    this.children = [...this.children, child];
  }
}
