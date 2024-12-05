import type { BaseWSMessage, WSMessage } from '$lib/types/ws/messages/base';
import { writable } from 'svelte/store';
import { MessageProcessor } from './MessageProcessor';
import type { WebSocketStore } from '$lib/stores/websocket';
import { getImageboardState, type Imageboard } from '../imageboard/Imageboard.svelte';
import type { Users } from '../users/Users.svelte';

export class WebSocketClient {
  private static instance: WebSocketClient;
  private messageProcessor: MessageProcessor;
  private imageboardState: Imageboard;
  private usersState: Users;
  private wsStore: WebSocketStore;

  private constructor(wsStore: WebSocketStore, imageboardState: Imageboard, usersState: Users) {
    this.wsStore = wsStore;
    this.imageboardState = imageboardState;
    this.usersState = usersState;
    this.messageProcessor = MessageProcessor.getInstance({ imageboardState, usersState });
  }

  public static initialize(wsStore: WebSocketStore, imageboardState: Imageboard, usersState: Users): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient(wsStore, imageboardState, usersState);
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
    return this.messageProcessor.handleMessage(message);
  }
}
