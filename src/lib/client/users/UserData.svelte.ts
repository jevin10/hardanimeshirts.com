import type { badges, posts_new } from "@prisma/client";

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
  posts: posts_new[] = $state([]);

  constructor(
    id: { userId: string; username: string },
    data: Partial<Omit<UserData, 'id'>> = {}
  ) {
    this.id = id;
    Object.assign(this, data);
  }
}
