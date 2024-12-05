import { UserService } from "$lib/server/user/UserService";
import type DomainHandler from "$lib/shared/DomainHandler";
import type { RequestUserDataMessage, UserDataResponse, UserMessage } from "$lib/types/ws/messages/user";
import type { WebSocket } from "ws";
import { WebSocketManager } from "../../WebSocketManager";
import { UserHandlerError } from "$lib/client/ws/domains/user/UserDomainHandler.svelte";

export class UserDomainHandler implements DomainHandler<UserMessage> {
  private readonly userService: UserService;
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
    this.userService = UserService.getInstance();
    this.webSocketManager = WebSocketManager.getInstance();
  }

  async handle(message: UserMessage, user?: { username: string; id: string; } | null, ws?: WebSocket): Promise<void | UserMessage> {
    try {
      switch (message.action) {
        case 'request_user_data': {
          const requestMessage = message as RequestUserDataMessage;
          return this.requestUserData(requestMessage);
        }
      }
    } catch (err) {
      console.error('UserDomainHandler error:', {
        action: message.action,
        data: message.data,
        err
      });
      throw err;
    }
  }

  private async requestUserData(message: RequestUserDataMessage): Promise<UserDataResponse> {
    let { username, userId } = message.data;

    if (!userId && !username) {
      throw new UserHandlerError('Missing required field: userId or username must be provided');
    }

    try {
      // Fetch missing data based on provided field
      if (username && !userId) {
        userId = await this.userService.getUserId(username);
      } else if (userId && !username) {
        username = await this.userService.getUsername(userId);
      }

      // Handle potentially undefined values by converting to null
      return {
        domain: 'user',
        action: 'user_data_response',
        data: {
          username: username ?? null,
          userId: userId ?? null
        }
      };
    } catch (err) {
      throw new UserHandlerError(
        'Failed to retrieve user data',
        'USER_ERROR',
        { err }
      );
    }
  }
}