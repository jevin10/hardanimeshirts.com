import prisma from "$lib/prisma";
import { InviteCodeError } from "$lib/types/auth/errors";
import type { InviteCode } from "@prisma/client";
import { generate } from "random-words";

export async function generateInviteCode(userId: string): Promise<InviteCode> {
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
export async function validateInviteCode(code: string): Promise<InviteCode> {
  // First check if code exists
  const match = await prisma.inviteCode.findFirst({
    where: {
      code
    }
  });

  if (!match) {
    throw new InviteCodeError("Invite code doesn't exist");
    // check if the invite code has already been used
  } else if (match.usedBy) {
    throw new InviteCodeError("Invite code has already been used");
  }

  // Check if code is more than 2 weeks old
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  if (match.createdAt < twoWeeksAgo) {
    throw new InviteCodeError("Invite code expired");
  }

  return match;
}

// update an invite code that was used to generate a user
// usedBy is the userId of the person who used the invite code
export async function updateInviteCode(usedBy: string, code: InviteCode): Promise<InviteCode> {
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

