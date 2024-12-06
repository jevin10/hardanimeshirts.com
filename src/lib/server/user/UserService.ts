// TODO:
// get userdata
//    - get profilePicutre
//    - get progress
//    - get badges
//    - get online status
//    - get posts

import { error } from "@sveltejs/kit";
import type UserRepository from "./repository/UserRepository";
import { UserRepositoryImpl } from "./repository/UserRepositoryImpl";
import type { UserProgress } from "@prisma/client";
import { requestSchemas, type UserClientAction, type UserServerAction } from "$lib/types/ws/actions/user";

export class UserService {
  private static instance: UserService;
  private userRepository: UserRepository;

  private constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  // singleton
  public static getInstance(): UserService {
    if (!UserService.instance) {
      const userRepository = new UserRepositoryImpl();
      UserService.instance = new UserService(userRepository);
    }
    return UserService.instance;
  }

  async getUserId(username: string): Promise<string> {
    const userId: string | null = await this.userRepository.getUserId(username);
    if (!userId) {
      throw error(404, 'User not found');
    }
    return userId;
  }

  async getUsername(userId: string): Promise<string> {
    const username: string | null = await this.userRepository.getUsername(userId);
    if (!username) {
      throw error(404, 'User not found');
    }
    return username;
  }

  async getUserProgress(params: UserClientAction['request_progress']): Promise<UserServerAction['progress_response']> {
    const { userId, username } = params;
    if (!userId && !username) {
      throw error(400, 'Either userId or username must be provided');
    }

    const userProgress = await this.userRepository.getUserProgress(userId, username);

    // get userId or username if either are undefined
    const [resolvedUserId, resolvedUsername] = await Promise.all([
      userId || this.getUserId(username!),
      username || this.getUsername(userId!)
    ]);

    return {
      ...userProgress,
      userId: resolvedUserId,
      username: resolvedUsername
    }
  }

  async getUserPosts(params: UserClientAction['request_posts']): Promise<UserServerAction['posts_response']> {
    const { username, page, limit } = requestSchemas.posts.parse(params);
    const dbPosts = await this.userRepository.getUserPosts(username, page, limit);

    const posts: UserServerAction['posts_response'] = dbPosts.map(post => ({
      ...post,
      created_at: post.created_at ?? new Date()
    }));

    return posts;
  }
}
