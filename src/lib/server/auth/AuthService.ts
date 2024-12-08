import prisma from "$lib/prisma";
import { loginSchema, signupSchema, type LoginInput, type SignupInput } from "$lib/types/auth/inputs";
import { hash, verify } from "@node-rs/argon2";
import { lucia } from "../auth";
import type { Cookies, RequestEvent } from "@sveltejs/kit";
import { ZodError } from "zod";
import { Prisma, type InviteCode, type User } from "@prisma/client";
import { generate } from "random-words";
import { generateIdFromEntropySize } from "lucia";
import { UserService } from "../user/UserService";
import { generateInviteCode, updateInviteCode, validateInviteCode } from "./utils/inviteCode";
import { SignupError } from "$lib/types/auth/errors";

export class AuthService {
  private static instance: AuthService;
  private userService: UserService;

  private constructor() {
    this.userService = UserService.getInstance();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
      console.log('[Authentication] Creating new AuthService');
    }
    return AuthService.instance;
  }

  async login(input: LoginInput, cookies: Cookies): Promise<void> {
    try {
      // Validate input
      const validated = loginSchema.parse(input);
      console.log('[Authentication] Attempting login in with:', validated);

      // check if user exists
      const existingUser = await prisma.user.findUniqueOrThrow({
        where: { username: validated.username }
      });

      // verify password
      const validPassword = await verify(existingUser.password_hash, validated.password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
      });

      if (!validPassword) {
        throw new Error('Invalid password');
      }

      // log in user
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes
      });
    } catch (err) {
      if (err instanceof ZodError) {
        throw new Error('Invalid input format');
      }

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // P2025 is "Record not found" error
        if (err.code === 'P2025') {
          throw new Error('Invalid username or password');
        }
      }

      if (err instanceof Error) {
        if (err.message === 'Invalid password') {
          throw new Error('Invalid username or password');
        }
      }

      console.error('[Authentication] Login error:', err);
      throw new Error('Internal server error');
    }
  }

  async signup(input: SignupInput): Promise<void> {
    try {
      const { username, password, inviteCode } = input;

      // get a user that matches the username
      const existingUser = await prisma.user.findUnique({
        where: { username }
      })
      // if a user with the username exists, throw error
      if (existingUser) {
        throw new Error('Username already taken');
      }

      // validate the invite code
      const validCode = await validateInviteCode(inviteCode);

      // generate a userId
      const userId = generateIdFromEntropySize(10);
      // generate passwordHash
      const passwordHash = await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
      });

      // create user
      const user: User = await this.userService.createUser(userId, username, passwordHash);

      // update the invite code to used
      const updatedCode = await updateInviteCode(user.id, validCode);

      console.log('Signed up with:', { username, password, inviteCode });
    } catch (err) {
      if (err instanceof Error) {
        throw new SignupError(input, err);
      } else {
        throw new SignupError(input, new Error('Unknown error occurred'));
      }
    }
  }


  async generateInviteCode(userId: string): Promise<InviteCode> {
    const inviteCode: InviteCode = await generateInviteCode(userId);
    return inviteCode;
  }
}
