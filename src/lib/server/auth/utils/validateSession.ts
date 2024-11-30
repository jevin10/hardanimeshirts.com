import prisma from "$lib/prisma";
import type { SessionValidationResult } from "$lib/types/auth";

export async function validateSession(sessionId: string): Promise<SessionValidationResult> {
  const result = await prisma.session.findUnique({
    where: {
      id: sessionId
    },
    include: {
      User: true
    }
  });
  if (result === null) {
    return { session: null, user: null };
  }
  const { User, ...session } = result;
  if (Date.now() >= session.expiresAt.getTime()) {
    await prisma.session.delete({ where: { id: sessionId } });
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await prisma.session.update({
      where: {
        id: session.id
      },
      data: {
        expiresAt: session.expiresAt
      }
    });
  }
  return { session, user: User };
}
