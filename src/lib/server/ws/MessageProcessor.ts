import type { BaseWSMessage } from "$lib/types/ws/messages/base";
import type DomainHandler from "./DomainHandler";
import { ImageboardDomainHandler } from "./domains/imageboard/ImageboardDomainHandler";

// Takes messages and routes them to their proper DomainHandlers
export class MessageProcessor {
  private domainHandlers: Map<string, DomainHandler<BaseWSMessage>>;

  constructor() {
    this.domainHandlers = new Map();
    // register domain handlers
    this.domainHandlers.set('imageboard', new ImageboardDomainHandler());
  }

  async handleMessage<T extends BaseWSMessage>(message: T): Promise<T | void> {
    const handler = this.domainHandlers.get(message.domain) as DomainHandler<T>;

    if (!handler) {
      throw new Error(`No handler for domain: ${message.domain}`);
    }

    return await handler.handle(message);
  }
}
