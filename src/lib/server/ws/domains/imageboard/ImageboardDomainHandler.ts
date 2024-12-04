import { z } from 'zod';
import type { posts_new } from "@prisma/client";
import { createPostSchema, type CreatePostPayload } from '$lib/types/ws/actions/schemas';
import type { ImageboardServerAction } from '$lib/types/ws/actions/imageboard';
import type { WebSocket } from 'ws';
import type { ImageboardMessage } from '$lib/types/ws/messages/imageboard';
import { ImageboardService, imageboardService } from '$lib/server/imageboard/ImageboardService';
import type DomainHandler from '$lib/shared/DomainHandler';
import { WebSocketManager } from '../../WebSocketManager';

// Define the request content schema
const requestContentSchema = z.object({
  boardId: z.number().nullable(),
  page: z.number().min(1),
  threadId: z.number().optional(),
  limit: z.number().min(1)
});

// Type helper using schema inference
type RequestContentPayload = z.infer<typeof requestContentSchema>;

// Handles all websocket messages pertaining to the imageboard domain.
export class ImageboardDomainHandler implements DomainHandler<ImageboardMessage> {
  private readonly imageboardService: ImageboardService;
  private webSocketManager: WebSocketManager;
  private user: {
    username: string,
    id: string
  } | null;
  private ws: WebSocket;

  constructor(
    ws: WebSocket,
    user: {
      username: string,
      id: string
    } | null
  ) {
    this.ws = ws;
    this.user = user;
    this.imageboardService = imageboardService;
    this.webSocketManager = WebSocketManager.getInstance();
  }

  async handle(message: ImageboardMessage): Promise<ImageboardMessage | void> {
    switch (message.action) {
      case 'request_content':
        return this.handleRequestContent(message);
      case 'create_post':
        console.log('create_post action invoked');
        const result = await this.handleCreatePost(message);
        this.webSocketManager.broadcast(result);
        return;
      default:
        throw new Error(`Unhandled action: ${message.action}`);
    }
  }

  private async handleRequestContent(
    message: ImageboardMessage
  ): Promise<ImageboardMessage> {
    try {
      const validatedData = requestContentSchema.parse(message.data);
      const posts = await this.fetchPosts(validatedData);
      return {
        domain: 'imageboard',
        action: 'content_response',
        data: { posts }
      };
    } catch (err) {
      const message = this.returnErrorMessage(err);
      return message;
    }
  }

  private async handleCreatePost(message: ImageboardMessage): Promise<ImageboardMessage> {
    try {
      if (!this.user) {
        throw new Error('WebSocket does not have an associated user, cannot create post');
      }
      const validatedData = createPostSchema.parse(message.data);
      const response = await this.createPost(validatedData);
      return {
        domain: 'imageboard',
        action: 'post_created',
        data: response
      };
    } catch (err) {
      const message = this.returnErrorMessage(err);
      return message;
    }
  }

  private async fetchPosts(params: RequestContentPayload): Promise<posts_new[]> {
    console.log('fetching posts');
    return await imageboardService.getContent(
      params.boardId,
      params.page,
      params.limit,
      params.threadId
    );
  }

  private async createPost(params: CreatePostPayload): Promise<ImageboardServerAction['post_created']> {
    console.log('[createPost] creating post');
    const post = await imageboardService.uploadPost(params);
    return {
      post
    };
  }

  private returnErrorMessage(err: z.ZodError | Error | unknown): ImageboardMessage {
    if (err instanceof z.ZodError) {
      return {
        domain: 'imageboard',
        action: 'error',
        data: {
          code: 'VALIDATION_ERROR',
          message: err.errors.map(e => e.message).join(', ')
        }
      };
    }

    return {
      domain: 'imageboard',
      action: 'error',
      data: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to process request'
      }
    };
  }
}
