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
}
