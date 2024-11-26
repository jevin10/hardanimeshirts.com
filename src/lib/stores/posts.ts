import type { posts_new } from "@prisma/client";
import { getContext, setContext } from "svelte";
import { writable, type Writable } from "svelte/store";

export interface PostsData {
  threads: {
    parent: posts_new;
    children: posts_new[];
  }[];
  orphans: posts_new[];
}

export interface PostsStore {
  subscribe: Writable<PostsData>['subscribe'];
  add: (posts: posts_new[]) => void;
  // Optional: Add method to check if post exists
  hasPost: (postId: number) => boolean;
}

const POSTS_CTX_KEY = Symbol('POSTS_CTX');

function createPostsStore(): PostsStore {
  const { subscribe, set, update } = writable<PostsData>({
    threads: [],
    orphans: []
  });

  // Helper function to check if a post exists in the store
  function postExists(currentData: PostsData, postId: number): boolean {
    // Check in thread parents
    if (currentData.threads.some(t => t.parent.id === postId)) {
      return true;
    }
    // Check in thread children
    if (currentData.threads.some(t => t.children.some(c => c.id === postId))) {
      return true;
    }
    // Check in orphans
    return currentData.orphans.some(o => o.id === postId);
  }

  // TODO: add to individuals stores for boards and threads based on proximity
  function add(posts: posts_new[]) {
    update(currentData => {
      // filter out posts that already exist in the store
      const newPosts = posts.filter(post => !postExists(currentData, post.id));

      if (newPosts.length === 0) {
        return currentData;
      }

      // maps for quicker lookups
      const existingParents = new Map(currentData.threads.map(t => [t.parent.id, t]));
      const newPostsMap = new Map(newPosts.map(p => [p.id, p]));
      const newChildren = new Map<number, posts_new[]>();

      // split posts into parents (top-level posts) and orphans (posts whose parent is missing)
      const { parents, orphans } = newPosts.reduce((acc, post) => {
        // parent
        if (!post.parent_id) {
          acc.parents.push(post);
          // orphan
        } else if (!existingParents.has(post.parent_id) && !newPostsMap.has(post.parent_id)) {
          acc.orphans.push(post);
        } else {
          // reply gets grouped w/ siblings
          const parentId = post.parent_id;
          newChildren.set(parentId, [...(newChildren.get(parentId) || []), post]);
        }
        return acc;
      }, { parents: [] as posts_new[], orphans: [] as posts_new[] });

      // stitch back into final thread structure
      const newThreads = [
        // update existing threads w/ new replies
        ...currentData.threads.map(t => ({
          ...t,
          children: [...t.children, ...(newChildren.get(t.parent.id) || [])]
        })),
        ...parents.map(p => ({
          parent: p,
          children: newChildren.get(p.id) || []
        }))
      ];

      return {
        threads: newThreads,
        orphans: [...currentData.orphans, ...orphans]
      };
    });
  }

  // Public method to check if a post exists
  function hasPost(postId: number): boolean {
    let exists = false;
    subscribe(data => {
      exists = postExists(data, postId);
    })();
    return exists;
  }

  return {
    subscribe,
    add,
    hasPost
  };
}

export function setPostsStore(): PostsStore {
  const store = createPostsStore();
  setContext(POSTS_CTX_KEY, store);
  return store;
}

export function getPostsStore(): PostsStore {
  const store = getContext<PostsStore>(POSTS_CTX_KEY);
  if (!store) {
    throw new Error('getPostsStore must be used within a component with setPostsStore');
  }
  return store;
}
