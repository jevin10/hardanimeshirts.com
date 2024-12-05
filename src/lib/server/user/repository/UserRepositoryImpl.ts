import prisma from "$lib/prisma";
import type UserRepository from "./UserRepository";

export class UserRepositoryImpl implements UserRepository {
  // gets userId, returns null if not found
  async getUserId(username: string): Promise<string | null> {
    const { id } = await prisma.user.findUniqueOrThrow({
      where: { username },
      select: { id: true }
    });
    return id;
  }

  // gets username, returns null if not found
  async getUsername(userId: string): Promise<string | null> {
    const { username } = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { username: true }
    });
    return username;
  }
}
