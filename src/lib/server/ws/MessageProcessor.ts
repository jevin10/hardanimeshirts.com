import type { BaseWSMessage } from "../../types/ws/messages/base";
import type DomainHandler from "../../shared/DomainHandler";
import { ImageboardDomainHandler } from "./domains/imageboard/ImageboardDomainHandler";
import type { WebSocket } from "ws";
import { UserDomainHandler } from "./domains/user/UserDomainHandler";

// Processes messages for the server
// Takes messages and routes them to their proper DomainHandlers
export class MessageProcessor {
  private domainHandlers: Map<string, DomainHandler<BaseWSMessage>>;
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
    this.domainHandlers = new Map();
    // register domain handlers
    this.domainHandlers.set('imageboard', new ImageboardDomainHandler(ws, user));
    this.domainHandlers.set('user', new UserDomainHandler(ws, user));
  }

  async handleMessage<T extends BaseWSMessage>(message: T): Promise<T | void> {
    const handler = this.domainHandlers.get(message.domain) as DomainHandler<T>;

    if (!handler) {
      throw new Error(`No handler for domain: ${message.domain}`);
    }

    return await handler.handle(message, this.user, this.ws);
  }
}
