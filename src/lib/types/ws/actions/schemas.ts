import { z } from "zod";

export const createPostSchema = z.object({
  userId: z.string(),
  username: z.string(),
  boardId: z.number(),
  content: z.string().min(1).max(5000),
  imageUrl: z.string().nullable(),
  parentId: z.number().nullable()
})

export type CreatePostPayload = z.infer<typeof createPostSchema>;

