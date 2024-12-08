import type { posts_new, User, UserProgress } from "@prisma/client";

export default interface UserRepository {
  getUserId(username: string): Promise<string | null>;
  getUsername(userId: string): Promise<string | null>;
  getUserProgress(userId?: string, username?: string): Promise<UserProgress>;
  getUserPosts(username: string, page: number, limit: number): Promise<posts_new[]>;
  createUser(userId: string, username: string, passwordHash: string): Promise<User>;
  createUserProgress(userId: string, level?: number, currentXp?: number): Promise<UserProgress>;
}
