import prisma from "$lib/prisma";
import { loginSchema, signupSchema, type LoginInput, type SignupInput } from "$lib/types/auth/inputs";
import { verify } from "@node-rs/argon2";
import { lucia } from "../auth";
import type { Cookies, RequestEvent } from "@sveltejs/kit";
import { ZodError } from "zod";
import { Prisma, type InviteCode } from "@prisma/client";
import { generate } from "random-words";

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


  async generateInviteCode(userId: string): Promise<InviteCode> {
    // Try to generate a unique code up to 5 times
    for (let attempts = 0; attempts < 5; attempts++) {
      const code = generate({
        exactly: 3,
        join: "-",
        maxLength: 5
      });

      const match = await prisma.inviteCode.findFirst({
        where: { code }
      });

      if (!match) {
        // Create the invite code record
        const inviteCode = await prisma.inviteCode.create({
          data: {
            code,
            generatedBy: userId
          }
        });
        return inviteCode;
      }
    }

    // If we failed to generate a unique code after 5 attempts, throw an error
    throw new Error('Failed to generate unique invite code after multiple attempts');
  }

  // returns a valid invite code
  // returns null if invalid or doesnt exist
  async validateInviteCode(code: string): Promise<InviteCode | null> {
    const match = await prisma.inviteCode.findFirst({
      where: {
        code,
        usedBy: null
      }
    });

    return match;
  }

  // update an invite code that was used to generate a user
  // usedBy is the userId of the person who used the invite code
  async updateInviteCode(usedBy: string, code: InviteCode): Promise<InviteCode> {
    const updatedCode = await prisma.inviteCode.update({
      where: {
        id: code.id
      },
      data: {
        usedBy,
        usedAt: new Date()
      }
    })
    return updatedCode;
  }
}
