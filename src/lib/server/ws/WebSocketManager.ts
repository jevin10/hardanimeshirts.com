import { WebSocket } from "ws";
import { WebSocketConnection } from "./WebSocketConnection";
import { IncomingMessage } from 'http';
import { validateSession } from "../auth/utils/validateSession";
import type { BaseWSMessage } from "$lib/types/ws/messages/base";

export class WebSocketManager {
  private static instance: WebSocketManager;
  private connections: Set<WebSocketConnection>;

  private constructor() {
    this.connections = new Set<WebSocketConnection>();
  }

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  private getSessionCookie(cookies: string | undefined): string | null {
    if (!cookies) return null;

    const sessionCookie = cookies
      .split(';')
      .find(c => c.trim().startsWith('auth_session='));

    return sessionCookie?.split('=')[1] || null;
  }

  private createConnection(ws: WebSocket, req: IncomingMessage, authData: { username: string; id: string } | null): void {
    const connection = new WebSocketConnection(ws, req, authData);

    this.connections.add(connection);

    // Remove connection when it closes
    ws.on('close', () => {
      this.connections.delete(connection);
    });

    const authStatus = authData ? `authenticated as ${authData.username}` : 'anonymous';
    console.log(`[wss:kit] new ${authStatus} connection created`);
  }

  async handleNewConnection(ws: WebSocket, req: IncomingMessage): Promise<void> {
    try {
      const sessionId = this.getSessionCookie(req.headers.cookie);

      if (!sessionId) {
        this.createConnection(ws, req, null);
        return;
      }

      const { session, user } = await validateSession(sessionId);

      if (!session || !user) {
        this.createConnection(ws, req, null);
        return;
      }

      this.createConnection(ws, req, {
        username: user.username,
        id: user.id
      });

    } catch (error) {
      console.error('[wss:kit] error processing connection:', error);
      this.createConnection(ws, req, null);
    }
  }

  // send a message to all connected WebSocketConnections
  public broadcast<T extends BaseWSMessage>(message: T): void {
    for (const connection of this.connections) {
      try {
        // Simply send the message directly
        connection.send(message);
      } catch (err) {
        console.error(`[WebSocketManager] Error broadcasting message (${connection.socketId}):`, err);
      }
    }
  }
}
