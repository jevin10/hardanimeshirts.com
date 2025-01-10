import { z } from "zod";

// Custom type guard for Uint8Array
const isUint8Array = (value: unknown): value is Uint8Array => {
  return value instanceof Uint8Array;
};

// Create Uint8Array schema
const uint8ArraySchema = z.custom<Uint8Array>(isUint8Array, {
  message: "Invalid image format - expected Uint8Array"
});

export const createPostSchema = z.object({
  userId: z.string(),
  username: z.string(),
  boardId: z.number(),
  content: z.string().min(1).max(5000),
  image: z.union([z.record(z.number()), z.null()]),
  parentId: z.number().nullable()
});

export type CreatePostPayload = z.infer<typeof createPostSchema>;
