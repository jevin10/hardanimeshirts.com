import type { Imageboard } from "$lib/client/imageboard/Imageboard.svelte";
import type { UserData } from "$lib/client/users/UserData.svelte";
import type { Users } from "$lib/client/users/Users.svelte";
import type DomainHandler from "$lib/shared/DomainHandler";
import type { UserServerAction } from "$lib/types/ws/actions/user";
import type { UserDataResponse, UserMessage } from "$lib/types/ws/messages/user";
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

// TODO: Register this domain in MessageProcessor
export class UserDomainHandler implements DomainHandler<UserMessage> {
  private usersState?: Users;
  private imageboardState?: Imageboard;
  private logger: Console;

  constructor(logger: Console = console) {
    this.logger = logger;
  }

  init(deps: { usersState: Users, imageboardState: Imageboard }) {
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
        case 'user_data_response': {
          const responseMessage = message as UserDataResponse;
          await this.handleDataResponse(responseMessage);
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

  private async handleDataResponse(message: UserDataResponse): Promise<void> {
    // Validate inputs
    if (!message.data.userId || !message.data.username) {
      throw new UserHandlerError('Missing required field: userId and username must be provided');
    }

    if (!this.usersState) {
      throw new UserHandlerError('Users state not initialized');
    }

    // Type assertion since we know userId is non-null from check above
    const userId = message.data.userId as string;
    const userData = this.usersState.users.get(userId);

    if (!userData) {
      throw new UserHandlerError('User data not found');
    }

    // Set user data with non-null values
    userData.id = {
      username: message.data.username as string,
      userId: userId
    };
  }
}
