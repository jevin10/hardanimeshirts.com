import prisma from "$lib/prisma";
import { loginSchema, signupSchema, type LoginInput, type SignupInput } from "$lib/types/auth/inputs";
import { verify } from "@node-rs/argon2";
import { lucia } from "../auth";
import type { Cookies, RequestEvent } from "@sveltejs/kit";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export class AuthService {
  private static instance: AuthService;

  private constructor() { }

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
    // Validate input 
    const validated = signupSchema.parse(input);
    console.log('Signed up with:', validated);
  }
}
