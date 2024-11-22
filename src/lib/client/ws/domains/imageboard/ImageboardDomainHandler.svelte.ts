import type DomainHandler from "$lib/shared/DomainHandler";
import type { ImageboardMessage } from "$lib/types/ws/messages/imageboard";
import type { WebSocketStore } from '$lib/stores/websocket';
import type { PostsStore } from "$lib/stores/posts";
import type { posts_new } from "@prisma/client";
import type { ImageboardServerAction } from "$lib/types/ws/actions/imageboard";

// Custom error class for domain-specific errors
export class ImageboardHandlerError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ImageboardHandlerError';
  }
}

export class ImageboardDomainHandler implements DomainHandler<ImageboardMessage> {
  private postsStore?: PostsStore;
  private logger: Console;

  constructor(logger: Console = console) {
    this.logger = logger;
  }

  init(deps: { postsStore: PostsStore }) {
    this.postsStore = deps.postsStore;
  }

  async handle(message: ImageboardMessage): Promise<void | ImageboardMessage> {
    if (!this.postsStore) {
      throw new ImageboardHandlerError('Handler not initialized');
    }

    try {
      switch (message.action) {
        case 'content_response': {
          const contentMessage = message as ImageboardMessage & {
            action: 'content_response';
            data: ImageboardServerAction['content_response'];
          };
          await this.handleContentResponse(contentMessage);
          return;
        }
        case 'error': {
          // Handle error messages from server
          const errorMessage = message as ImageboardMessage & {
            action: 'error';
            data: ImageboardServerAction['error'];
          };
          await this.handleError(errorMessage);
          return;
        }
        default:
          throw new ImageboardHandlerError(`Unhandled action: ${message.action}`);
      }
    } catch (error) {
      this.logger.error('ImageboardDomainHandler error:', {
        action: message.action,
        data: message.data,
        error
      });
      throw error;
    }
  }

  private async handleContentResponse(
    message: ImageboardMessage & {
      action: 'content_response';
      data: ImageboardServerAction['content_response'];
    }
  ): Promise<void> {
    const { posts } = message.data;
    await this.pushPosts({ posts });
  }

  private async handleError(
    message: ImageboardMessage & {
      action: 'error';
      data: ImageboardServerAction['error'];
    }
  ): Promise<void> {
    const { code, message: errorMessage } = message.data;

    this.logger.error('Received server error:', {
      code,
      message: errorMessage,
      data: message.data
    });

    throw new ImageboardHandlerError(errorMessage, code, message.data);
  }

  private async pushPosts(params: { posts: posts_new[] }): Promise<void> {
    if (!params.posts) {
      throw new ImageboardHandlerError('No posts to push');
    }

    try {
      this.postsStore!.add(params.posts);
    } catch (error) {
      throw new ImageboardHandlerError(
        'Failed to add posts to store',
        'STORE_ERROR',
        { error }
      );
    }
  }
}
