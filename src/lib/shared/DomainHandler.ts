import type { WebSocketClient } from "$lib/client/ws/WebSocketClient";
import type { BaseWSMessage } from "$lib/types/ws/messages/base";
import type { WebSocket } from "ws";

// Basic interface for a DomainHandler
// a DomainHandler handles received messages related to their domain, and returns messages for the server/client to send.
export default interface DomainHandler<T extends BaseWSMessage = BaseWSMessage> {
  handle(
    message: T,
    user?: {
      username: string,
      id: string
    } | null,
    ws?: WebSocket
  ): Promise<T | void>;
  init?(deps: Record<string, any>): void;
}

