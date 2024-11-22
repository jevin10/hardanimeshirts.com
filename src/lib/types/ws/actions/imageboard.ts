import type { posts_new } from "@prisma/client";

interface RequestContentPayload {
  boardId: number | null; // if null is passed, then it's just all boards
  page: number;
  threadId?: string;
  limit: number;
}

// TODO: edit this payload to match params
interface CreatePostPayload {
  content: string;
  threadId?: string;
  imageUrl?: string;
}

// client->server actions and their payloads
export type ImageboardClientAction = {
  'request_content': RequestContentPayload;
  'create_post': CreatePostPayload;
  'delete_post': { postId: number };
  'subscribe_thread': { threadId: number };
  'unsubscribe_thread': { threadId: number };
}

// server->client actions and their payloads
export type ImageboardServerAction = {
  'content_response': { posts: posts_new[] };
  'post_created': { post: posts_new };
  'post_deleted': { postId: number };
  'thread_response': { thread: posts_new & posts_new[] };
  'error': {
    code: string;
    message: string;
    details?: any;
  };
}

// Type helpers for accessing these
export type ImageboardActionType = keyof (ImageboardClientAction & ImageboardServerAction);
export type ImageboardPayload<T extends ImageboardActionType> =
  T extends keyof ImageboardClientAction ? ImageboardClientAction[T] :
  T extends keyof ImageboardServerAction ? ImageboardServerAction[T] :
  never;
