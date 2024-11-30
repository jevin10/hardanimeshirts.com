import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().toLowerCase().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  username: z.string().toLowerCase().min(1, "Username is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one symbol"),
  inviteCode: z.string().min(1, "Invite code is required"),
});

// Type inference
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
