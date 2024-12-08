import type { SignupInput } from "./inputs";

export class SignupError extends Error {
  constructor(input: SignupInput, cause?: Error) {
    super(`Failed to sign up with input: ${input}`);
    this.name = 'SignupError';
    this.cause = cause;
  }
}

