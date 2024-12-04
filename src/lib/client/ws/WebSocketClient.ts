import type { BaseWSMessage, WSMessage } from '$lib/types/ws/messages/base';
import { writable } from 'svelte/store';
import { MessageProcessor } from './MessageProcessor';
import type { PostsStore } from '$lib/stores/posts';
import type { WebSocketStore } from '$lib/stores/websocket';
import { getImageboardState, type Imageboard } from '../imageboard/Imageboard.svelte';

export class WebSocketClient {
  private static instance: WebSocketClient;
  private messageProcessor: MessageProcessor;
  private imageboardState: Imageboard;
  private postsStore: PostsStore;
  private wsStore: WebSocketStore;

  private constructor(postsStore: PostsStore, wsStore: WebSocketStore, imageboardState: Imageboard) {
    this.postsStore = postsStore;
    this.wsStore = wsStore;
    this.imageboardState = imageboardState;
    this.messageProcessor = MessageProcessor.getInstance({ postsStore, imageboardState });
  }

  public static initialize(postsStore: PostsStore, wsStore: WebSocketStore, imageboardState: Imageboard): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient(postsStore, wsStore, imageboardState);
    }
    return WebSocketClient.instance;
  }

  public static getInstance(): WebSocketClient {
    if (!WebSocketClient.instance) {
      throw new Error('WebSocketClient not initialized. Call initialize() first.');
    }
    return WebSocketClient.instance;
  }

  public static getImageboardState(): Imageboard {
    if (!WebSocketClient.instance) {
      throw new Error('WebSocketClient not initialized. Call initialize() first.');
    }
    return WebSocketClient.instance.imageboardState;
  }

  async processMessage(message: BaseWSMessage) {
    console.log('processing message');
    return this.messageProcessor.handleMessage(message);
  }
}
