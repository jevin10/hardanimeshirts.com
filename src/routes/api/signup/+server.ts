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

    // validate with zod schema
    const validated = signupSchema.parse(signupData);

    authService.signup(validated);
    return json({
      status: 201
    });
  } catch (err) {
    console.error('Failed to sign up user:', err);

    if (err instanceof ZodError) {
      throw error(406, err.message);
    }

    if (err instanceof SignupError && err.cause instanceof Error) {
      throw error(500, err.cause.message);
    }

    throw error(500, 'Unknown error occurred');
  }
}
