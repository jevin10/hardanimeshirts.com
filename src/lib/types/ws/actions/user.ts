import type { posts_new, soul_points, user_badges, UserProgress } from "@prisma/client";
import { z } from "zod";

// Constants
export const MAX_FILE_SIZE = 5000000;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Client Request Schemas
export const requestSchemas = {
  posts: z.object({
    username: z.string(),
    page: z.number(),
    limit: z.number()
  }),

  userData: z.object({
    username: z.string().optional(),
    userId: z.string().optional()
  }),

  updateProgress: z.object({
    username: z.string().optional(),
    userId: z.string().optional(),
    xpIncrement: z.number()
  }),

  updatePfp: z.object({
    userId: z.string(),
    image: z
      .any()
      .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
      )
  })
} as const;

// Server Response Schemas
export const responseSchemas = {
  progress: z.object({
    userId: z.string(),
    level: z.number(),
    currentXp: z.number(),
    createdAt: z.date(),
    updatedAt: z.date()
  }) satisfies z.ZodType<UserProgress>,

  posts: z.array(
    z.object({
      id: z.number(),
      board_id: z.number(),
      parent_id: z.number().nullable(),
      content: z.string(),
      created_at: z.date(),
      user_id: z.string(),
      image_url: z.string().nullable(),
      latest_activity: z.date().nullable()
    })
  ) satisfies z.ZodType<posts_new[]>,

  pfp: z.object({
    username: z.string(),
    userId: z.string(),
    imageUrl: z.string().nullable()
  }),

  badges: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      css: z.string(),
      description: z.string(),
      createdAt: z.string()
    })
  ),

  soulPoints: z.object({
    userId: z.string(),
    username: z.string(),
    soulPoints: z.number()
  }),

  userData: z.object({
    userId: z.string().nullable(),
    username: z.string().nullable()
  }),

  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional()
  })
} as const;

// Type Inference
type PayloadTypes = {
  // Request payloads
  RequestUserPosts: z.infer<typeof requestSchemas.posts>;
  RequestUserData: z.infer<typeof requestSchemas.userData>;
  UpdateUserProgress: z.infer<typeof requestSchemas.updateProgress>;
  UpdateUserPfp: z.infer<typeof requestSchemas.updatePfp>;
  // Response payloads
  ProgressResponse: z.infer<typeof responseSchemas.progress>;
  UserDataResponse: z.infer<typeof responseSchemas.userData>;
  PostsResponse: z.infer<typeof responseSchemas.posts>;
  PfpResponse: z.infer<typeof responseSchemas.pfp>;
  BadgesResponse: z.infer<typeof responseSchemas.badges>;
  SoulPointsResponse: z.infer<typeof responseSchemas.soulPoints>;
};

// Action Types
export type UserClientAction = {
  'request_progress': PayloadTypes['RequestUserData'];
  'request_user_data': PayloadTypes['RequestUserData'];
  'request_posts': PayloadTypes['RequestUserPosts'];
  'request_pfp': PayloadTypes['RequestUserData'];
  'request_badges': PayloadTypes['RequestUserData'];
  'request_soul_points': PayloadTypes['RequestUserData'];
  'update_progress': PayloadTypes['UpdateUserProgress'];
  'update_pfp': PayloadTypes['UpdateUserPfp'];
};

export type UserServerAction = {
  'progress_response': PayloadTypes['ProgressResponse'];
  'posts_response': PayloadTypes['PostsResponse'];
  'pfp_response': PayloadTypes['PfpResponse'];
  'badges_response': PayloadTypes['BadgesResponse'];
  'soul_points_response': PayloadTypes['SoulPointsResponse'];
  'user_data_response': PayloadTypes['UserDataResponse'];
  'error': z.infer<typeof responseSchemas.error>;
};

export type UserActionType = keyof (UserClientAction & UserServerAction);
export type UserPayload<T extends UserActionType> =
  T extends keyof UserClientAction ? UserClientAction[T] :
  T extends keyof UserServerAction ? UserServerAction[T] :
  never;
