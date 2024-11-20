import { z } from 'zod';
import type { posts_new } from "@prisma/client";
import type { ImageboardMessage } from "$lib/types/ws/messages/imageboard";
import type DomainHandler from '../../DomainHandler';

// Define the request content schema
const requestContentSchema = z.object({
  boardId: z.number().nullable(),
  page: z.number().min(1),
  threadId: z.string().optional(),
  limit: z.number().min(1)
});

// Type helper using schema inference
type RequestContentPayload = z.infer<typeof requestContentSchema>;

// Handles all websocket messages pertaining to the imageboard domain.
export class ImageboardDomainHandler implements DomainHandler<ImageboardMessage> {
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
      // Validate the message data against our schema
      const validatedData = requestContentSchema.parse(message.data);

      const posts = await this.fetchPosts(validatedData);

      return {
				domain: 'imageboard',
        action: 'content_response',
        data: { posts }
      };

    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        return {
					domain: 'imageboard',
          action: 'error',
          data: {
            code: 'VALIDATION_ERROR',
            message: error.errors.map(e => e.message).join(', ')
          }
        };
      }

      // Handle other errors
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

	// TODO: Abstract this and make it actually work
  private async fetchPosts(params: RequestContentPayload): Promise<posts_new[]> {
    // Implement your database query logic here
		params.boardId
    return [ { id: 1, board_id: 1, parent_id: null, content: 'test', created_at: null, user_id: '1owroller', image_url: null, latest_activity: null} ];
  }
}
