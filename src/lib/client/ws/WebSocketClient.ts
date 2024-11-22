import type { BaseWSMessage, WSMessage } from '$lib/types/ws/messages/base';
import { writable } from 'svelte/store';
import { MessageProcessor } from './MessageProcessor';
import type { PostsStore } from '$lib/stores/posts';
import type { WebSocketStore } from '$lib/stores/websocket';

export class WebSocketClient {
  private static instance: WebSocketClient;
  private messageProcessor: MessageProcessor;
  private postsStore: PostsStore;
  private wsStore: WebSocketStore;

  private constructor(postsStore: PostsStore, wsStore: WebSocketStore) {
    this.postsStore = postsStore;
    this.wsStore = wsStore;
    this.messageProcessor = MessageProcessor.getInstance({ postsStore });
  }

  public static initialize(postsStore: PostsStore, wsStore: WebSocketStore): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient(postsStore, wsStore);
    }
    return WebSocketClient.instance;
  }

  public static getInstance(): WebSocketClient {
    if (!WebSocketClient.instance) {
      throw new Error('WebSocketClient not initialized. Call initialize() first.');
    }
    return WebSocketClient.instance;
  }

  async processMessage(message: BaseWSMessage) {
    console.log('processing message');
    return this.messageProcessor.handleMessage(message);
  }
}
