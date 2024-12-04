import type { BaseWSMessage } from "$lib/types/ws/messages/base";
import type DomainHandler from "$lib/shared/DomainHandler";
import { ImageboardDomainHandler } from "./domains/imageboard/ImageboardDomainHandler.svelte";
import type { Imageboard } from "../imageboard/Imageboard.svelte";

export class HandlerInitializationError extends Error {
  constructor(domain: string, cause?: Error) {
    super(`Failed to initialize handler for domain: ${domain}`);
    this.name = 'HandlerInitializationError';
    this.cause = cause;
  }
}

export class MessageHandlingError extends Error {
  constructor(domain: string, cause?: Error) {
    super(`Failed to process message for domain: ${domain}`);
    this.name = 'MessageHandlingError';
    this.cause = cause;
  }
}

export class UnknownDomainError extends Error {
  constructor(domain: string) {
    super(`No handler registered for domain: ${domain}`);
    this.name = 'UnknownDomainError';
  }
}

interface MessageProcessorDeps {
  imageboardState: Imageboard;
}

export class MessageProcessor {
  private static instance: MessageProcessor | null = null;
  private domainHandlers: Map<string, DomainHandler<BaseWSMessage>>;
  private deps: MessageProcessorDeps;
  private logger: Console;

  private constructor(deps: MessageProcessorDeps, logger: Console = console) {
    this.deps = deps;
    this.domainHandlers = new Map();
    this.logger = logger;

    try {
      this.registerHandlers();
    } catch (error) {
      this.logger.error('Failed to register handlers:', error);
      throw new HandlerInitializationError('all', error instanceof Error ? error : undefined);
    }
  }

  public static getInstance(deps: MessageProcessorDeps, logger: Console = console): MessageProcessor {
    if (!MessageProcessor.instance) {
      MessageProcessor.instance = new MessageProcessor(deps, logger);
    }
    return MessageProcessor.instance;
  }

  private registerHandlers(): void {
    try {
      const imageboardHandler = new ImageboardDomainHandler();
      try {
        imageboardHandler.init?.(this.deps);
      } catch (error) {
        throw new HandlerInitializationError('imageboard', error instanceof Error ? error : undefined);
      }
      this.domainHandlers.set('imageboard', imageboardHandler);
    } catch (error) {
      this.logger.error('Handler registration failed:', error);
      throw error;
    }
  }

  async handleMessage<T extends BaseWSMessage>(message: T): Promise<T | void> {
    try {
      if (!message || !message.domain) {
        throw new Error('Invalid message format');
      }

      const handler = this.domainHandlers.get(message.domain) as DomainHandler<T>;

      if (!handler) {
        throw new UnknownDomainError(message.domain);
      }

      try {
        return await handler.handle(message);
      } catch (error) {
        throw new MessageHandlingError(
          message.domain,
          error instanceof Error ? error : undefined
        );
      }
    } catch (error) {
      this.logger.error(
        'Message processing failed:',
        {
          domain: message?.domain,
          error
        }
      );
      throw error;
    }
  }

  hasDomainHandler(domain: string): boolean {
    return this.domainHandlers.has(domain);
  }

  getRegisteredDomains(): string[] {
    return Array.from(this.domainHandlers.keys());
  }

  // Optional: Method to reset the instance (useful for testing)
  public static resetInstance(): void {
    MessageProcessor.instance = null;
  }
}
