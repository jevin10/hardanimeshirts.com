import type { posts_new, UserProgress } from "@prisma/client";

export default interface UserRepository {
  getUserId(username: string): Promise<string | null>;
  getUsername(userId: string): Promise<string | null>;
  getUserProgress(userId?: string, username?: string): Promise<UserProgress>;
  getUserPosts(username: string, page: number, limit: number): Promise<posts_new[]>;
}
