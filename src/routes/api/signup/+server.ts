import { AuthService } from "$lib/server/auth/AuthService";
import { SignupError } from "$lib/types/auth/errors";
import { signupSchema, type SignupInput } from "$lib/types/auth/inputs";
import { error, json, type RequestHandler } from "@sveltejs/kit";
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

    const validated = signupSchema.parse(signupData);
    await authService.signup(validated);

    return json({ status: 201 });
  } catch (err) {
    console.error('Failed to sign up user:', err);

    if (err instanceof ZodError) {
      // Format Zod errors into a readable message
      const errors = err.errors.map(e => e.message).join(', ');
      throw error(406, { message: errors });
    }

    if (err instanceof SignupError && err.cause instanceof Error) {
      throw error(500, { message: err.cause.message });
    }

    throw error(500, { message: 'Unknown error occurred' });
  }
}
