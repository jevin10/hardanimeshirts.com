import type { posts_new } from "@prisma/client";

export class Thread {
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
