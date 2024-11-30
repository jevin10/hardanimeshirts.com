import { json, type RequestHandler } from "@sveltejs/kit";
import { AuthService } from "$lib/server/auth/AuthService";
import { loginSchema, type LoginInput } from "$lib/types/auth/inputs";
import { ZodError } from "zod";

const authService = AuthService.getInstance();

export const POST: RequestHandler = async (event) => {
  try {
    const formData = await event.request.formData();

    const loginData: LoginInput = {
      username: formData.get('username')?.toString() ?? '',
      password: formData.get('password')?.toString() ?? ''
    };

    // Validate with zod schema
    const validated = loginSchema.parse(loginData);

    // Call auth service with validated data
    await authService.login(validated);

    return json({ success: true });

  } catch (err) {
    // Handle Zod validation errors
    if (err instanceof ZodError) {
      return json({
        error: err.errors
      }, { status: 400 });
    }

    // Handle other known errors
    if (err instanceof Error && 'status' in err) {
      return new Response(err.message, { status: err.status as number });
    }

    // Handle unexpected errors
    console.error('Login failed:', err);
    return new Response('Internal server error', { status: 500 });
  }
}
