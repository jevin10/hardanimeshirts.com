import { AuthService } from "$lib/server/auth/AuthService";
import { signupSchema, type SignupInput } from "$lib/types/auth/inputs";
import { error, type RequestHandler } from "@sveltejs/kit";
import { ZodError } from "zod";

const authService = AuthService.getInstance();

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    const signupData: SignupInput = {
      username: formData.get('username')?.toString() ?? '',
      password: formData.get('password')?.toString() ?? '',
      inviteCode: formData.get('inviteCode')?.toString() ?? ''
    };

    // validate with zod schema
    const validated = signupSchema.parse(signupData);

    authService.signup(validated);
  } catch (err) {
    if (err instanceof ZodError) {
      throw error(406, err.message);
    }
    console.error('Failed to sign up user:', err);
    throw error(500, 'Failed to generate invite code');
  }
}
