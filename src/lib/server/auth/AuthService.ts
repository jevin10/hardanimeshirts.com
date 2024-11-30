import { loginSchema, signupSchema, type LoginInput, type SignupInput } from "$lib/types/auth/inputs";

export class AuthService {
  constructor() { }

  async login(input: LoginInput): Promise<void> {
    // Validate input
    const validated = loginSchema.parse(input);
    console.log('Logged in with:', validated);
  }

  async signup(input: SignupInput): Promise<void> {
    // Validate input 
    const validated = signupSchema.parse(input);
    console.log('Signed up with:', validated);
  }
}
