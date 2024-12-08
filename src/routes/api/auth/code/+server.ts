import { AuthService } from "$lib/server/auth/AuthService";
import { json, error, type RequestHandler } from "@sveltejs/kit";

const authService = AuthService.getInstance();

export const POST: RequestHandler = async ({ locals }) => {
  if (!locals.session) {
    throw error(401, 'Unauthorized');
  }

  try {
    const inviteCode = await authService.generateInviteCode(locals.session.userId);

    return json({
      code: inviteCode.code,
      message: 'Invite code generated successfully'
    }, {
      status: 201
    });

  } catch (err) {
    console.error('Failed to generate invite code:', err);
    throw error(500, 'Failed to generate invite code');
  }
};
