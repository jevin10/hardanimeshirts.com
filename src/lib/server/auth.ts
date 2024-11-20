import { Lucia } from "lucia";
import { dev } from "$app/environment";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import prisma from "$lib/prisma";
import { error } from "@sveltejs/kit";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: !dev
    }
  },
  // maps database user fields to session user object
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username // only expose username to session
    };
  }
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  username: string;
}

// Require authentication
// 1. checks if there's a session associated with the event
// 2. returns user if true, throws error if false
export async function requireAuth(event: { locals: App.Locals }) {
  if (!event.locals.session || !event.locals.user?.id) {
    throw error(401, "Unauthorized");
  }
  return event.locals.user;
}

// For admin specific routes to be checked against userId
export async function requireUser(event: { locals: App.Locals }, userId: string) {
  if (!event.locals.session) {
    throw error(401, "Unauthorized");
  }
  if (event.locals.user?.id !== userId) {
    throw error(403, "Forbidden");
  }
  return event.locals.user!;
}

