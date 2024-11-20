import type { BaseWSMessage } from "$lib/types/ws/messages/base";

// Basic interface for a DomainHandler
// a DomainHandler handles client-sent messages related to their domain, and returns messages for the server to send.
export default interface DomainHandler<T extends BaseWSMessage = BaseWSMessage> {
  handle(message: T): Promise<T | void>;
}
