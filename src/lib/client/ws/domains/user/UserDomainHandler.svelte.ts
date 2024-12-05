import type { Imageboard } from "$lib/client/imageboard/Imageboard.svelte";
import type DomainHandler from "$lib/shared/DomainHandler";
import type { UserServerAction } from "$lib/types/ws/actions/user";
import type { UserMessage } from "$lib/types/ws/messages/user";
import type { WebSocket } from "ws";

export class UserHandlerError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'UserHandlerError';
  }
}

export class UserDomainHandler implements DomainHandler<UserMessage> {
  private usersState?: string;
  private imageboardState?: Imageboard;
  private logger: Console;

  constructor(logger: Console = console) {
    this.logger = logger;
  }

  init(deps: { usersState: string, imageboardState: Imageboard }) {
    this.usersState = deps.usersState;
    this.imageboardState = deps.imageboardState;
  }

  async handle(message: UserMessage, user?: { username: string; id: string; } | null): Promise<void | UserMessage> {
    if (!this.usersState) {
      throw new UserHandlerError('Handler not initialized');
    }

    try {
      switch (message.action) {
        case 'posts_response': {
          const contentMessage = message as UserMessage & {
            action: 'posts_response';
            data: UserServerAction['posts_response'];
          };
          await this.handlePostsResponse(contentMessage);
          return;
        }
        case 'error': {
          const errorMessage = message as UserMessage & {
            action: 'error';
            data: UserServerAction['error'];
          };
          await this.handleError(errorMessage);
          return;
        }
        default:
          throw new UserHandlerError(`Unhandled action: ${message.action}`);
      }
    } catch (err) {
      this.logger.error('UserDomainHandler error:', {
        action: message.action,
        data: message.data,
        err
      });
      throw err;
    }
  }

  private async handleError(
    message: UserMessage & {
      action: 'error';
      data: UserServerAction['error'];
    }
  ): Promise<void> {
    const { code, message: errorMessage } = message.data;

    this.logger.error('Received server error:', {
      code,
      message: errorMessage,
      data: message.data
    });

    throw new UserHandlerError(errorMessage, code, message.data);
  }

  private async handlePostsResponse(
    message: UserMessage & {
      action: 'posts_response';
      data: UserServerAction['posts_response'];
    }
  ): Promise<void> {
    const posts = message.data;
    if (!posts) {
      throw new UserHandlerError('No posts to push');
    }
    try {
      await this.imageboardState!.addPosts(posts);
    } catch (err) {
      throw new UserHandlerError(
        'Failed to add posts to store',
        'STORE_ERROR',
        { err }
      );
    }
  }
}
