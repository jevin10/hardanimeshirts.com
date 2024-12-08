import type { Imageboard } from "$lib/client/imageboard/Imageboard.svelte";
import type { UserData } from "$lib/client/users/UserData.svelte";
import type { Users } from "$lib/client/users/Users.svelte";
import type DomainHandler from "$lib/shared/DomainHandler";
import { calculateCurrentLevelProgress } from "$lib/shared/user/levelCalculations";
import { responseSchemas, type UserServerAction } from "$lib/types/ws/actions/user";
import type { UserDataResponse, UserMessage, UserProgressResponse } from "$lib/types/ws/messages/user";
import type { WebSocket } from "ws";
import { ZodError } from "zod";

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
        case 'progress_response': {
          const responseMessage = message as UserProgressResponse;
          await this.handleProgressResponse(responseMessage);
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
      return;
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
    const username = message.data.username;
    let userData = this.usersState.users.get(username);

    if (!userData) {
      console.log(`[HandleDataResponse] UserData ${username} not found, creating user data`)
      userData = this.usersState?.createUserData(userId, username);
    } else {
      // Set user data with non-null values
      userData.id = {
        username,
        userId
      };
    }
  }

  private async handleProgressResponse(message: UserProgressResponse): Promise<void> {
    try {
      // validate the message
      const validatedMessage = responseSchemas.progress.parse(message.data);
      const { userId, username } = validatedMessage;

      let userData = this.getOrCreateUserData(userId, username);

      // get currentLevelXp and xpBetweenLevels
      const { currentLevelXp, xpBetweenLevels } = calculateCurrentLevelProgress(userData.progress.currentXp);

      // set data
      userData.progress = {
        level: validatedMessage.level,
        currentXp: validatedMessage.currentXp,
        toNextLevel: xpBetweenLevels - currentLevelXp
      }
    } catch (err) {
      throw new UserHandlerError(
        'Failed to update progress for user',
        'PROGRESS_ERROR',
        { err }
      );
    }
  }

  private getOrCreateUserData(userId: string, username: string): UserData {
    console.log(`getting userData for ${username}`);
    if (!this.usersState) {
      throw new UserHandlerError('Users state not initialized');
    }
    const userData = this.usersState.users.get(username);
    if (userData) return userData;

    console.log(`UserData ${username} not found, creating user data`);
    return this.usersState.createUserData(userId, username);
  }
}
