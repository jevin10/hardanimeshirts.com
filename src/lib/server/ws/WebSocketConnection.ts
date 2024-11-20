import { nanoid } from 'nanoid';
import { WebSocket } from 'ws';
import type { IncomingMessage } from 'http';
import type { BaseWSMessage } from '$lib/types/ws/messages/base';
import { MessageProcessor } from './MessageProcessor';

// Represents a single live connection between client and server
// On authentication, the connection gets upgraded and associated with a userId
export class WebSocketConnection {
  public socketId: string;
  private userId: string | null;
  private ws: WebSocket;
  private messageProcessor: MessageProcessor;

  constructor(ws: WebSocket, req: IncomingMessage, messageProcessor: MessageProcessor) {
    this.socketId = nanoid();
    this.userId = null;
    this.ws = ws;
    this.messageProcessor = messageProcessor;
    this.initialize();
  }

  private initialize(): void {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.ws.on('message', async (data: Buffer) => {
      const message = JSON.parse(data.toString()) as BaseWSMessage;
      try {
        const message = JSON.parse(data.toString()) as BaseWSMessage;
        const response = await this.messageProcessor.handleMessage(message);
        if (response) {
          this.send(response);
        }
      } catch (err) {
        console.error(`[WebSocket] Error processing message (${this.socketId}):`, err);
        this.send({
          domain: message.domain,
          action: 'error',
          data: { message: 'Error processing message' }
        });
      }
    });

    this.ws.on('error', this.handleError.bind(this));
    this.ws.on('close', this.handleClose.bind(this));
  }

  private send(message: BaseWSMessage): void {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private handleError(error: Error): void {
    console.error(`[WebSocket] Error (${this.socketId}):`, error);
  }

  private handleClose(code: number, reason: Buffer): void {
    console.log(`[WebSocket] Client disconnected (${this.socketId})`);
    console.log(`[WebSocket] Close code: ${code}, reason: ${reason.toString()}`);
  }
}
