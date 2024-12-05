import type { badges, posts_new } from "@prisma/client";
import type { Imageboard } from "../imageboard/Imageboard.svelte";

export interface UserDataProps {
  id: {
    userId: string;
    username: string;
  }
  profilePicture: string;
  progress: {
    level: number;
    currentXp: number;
    toNextLevel: number;
  }
  badges: badges[];
  latestActivity: Date | null;
  online: boolean;
  posts: posts_new[];
}

export class UserData implements UserDataProps {
  private imageboardState: Imageboard;
  id: { userId: string; username: string; };
  profilePicture: string = $state('');
  progress: {
    level: number;
    currentXp: number;
    toNextLevel: number;
  } = $state({
    level: 0,
    currentXp: 0,
    toNextLevel: 0
  });
  badges: badges[] = $state([]);
  latestActivity: Date | null = $state(null);
  online: boolean = $state(false);
  posts: posts_new[] = $derived.by(() => {
    return this.imageboardState.allPosts.filter(post =>
      post.user_id === this.id.username
    );
  });

  constructor(
    id: { userId: string; username: string },
    imageboardState: Imageboard,
    data: Partial<Omit<UserData, 'id'>> = {}
  ) {
    this.id = id;
    Object.assign(this, data);
    this.imageboardState = imageboardState;
  }
}
