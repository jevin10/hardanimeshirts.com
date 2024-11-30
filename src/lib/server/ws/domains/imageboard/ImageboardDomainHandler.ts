import { z } from 'zod';
import type { posts_new } from "@prisma/client";
import type { ImageboardMessage } from "../../../../types/ws/messages/imageboard";
import type DomainHandler from '../../../../shared/DomainHandler';
import { ImageboardService, imageboardService } from '../../../../server/imageboard/ImageboardService';

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

  constructor() {
    this.imageboardService = imageboardService;
  }

  async handle(message: ImageboardMessage): Promise<ImageboardMessage> {
    switch (message.action) {
      case 'request_content':
        return this.handleRequestContent(message);
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
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          domain: 'imageboard',
          action: 'error',
          data: {
            code: 'VALIDATION_ERROR',
            message: error.errors.map(e => e.message).join(', ')
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

  private async fetchPosts(params: RequestContentPayload): Promise<posts_new[]> {
    console.log('fetching posts');
    return await imageboardService.getContent(
      params.boardId,
      params.page,
      params.limit,
      params.threadId
    );
  }
}
