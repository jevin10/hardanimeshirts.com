import { WebSocketServer } from 'ws';
import { parse } from 'url';
import type { IncomingMessage } from 'http';
import type { Duplex } from 'stream';

export const GlobalThisWSS = Symbol.for('sveltekit.wss');

export type ExtendedWebSocketServer = WebSocketServer;

export type ExtendedGlobal = typeof globalThis & {
  [GlobalThisWSS]: ExtendedWebSocketServer;
};


// Top level interface for managing websockets
export class ExtendedServer {
  private static instance: ExtendedServer;
  private wss: ExtendedWebSocketServer;

  private constructor() {
    this.wss = new WebSocketServer({ noServer: true }) as ExtendedWebSocketServer;
    this.initialize();
    this.setupEventHandlers();
  }

  public static getInstance(): ExtendedServer {
    if (!ExtendedServer.instance) {
      ExtendedServer.instance = new ExtendedServer();
      console.log('[WebSocket] Creating new WSS instance');
    }
    return ExtendedServer.instance;
  }

  public initialize(): void {
    if ((globalThis as ExtendedGlobal)[GlobalThisWSS]) {
      console.log('[WebSocket] WSS instance already exists');
      return;
    }

    (globalThis as ExtendedGlobal)[GlobalThisWSS] = this.wss;
    console.log('[WebSocket] Server initialized');
  }

  private setupEventHandlers(): void {
    this.wss.on('connection', (ws, req) => {
      console.log(`[wss:global] client connected`);
    });
  }

  public handleUpgrade(req: IncomingMessage, socket: Duplex, head: Buffer): void {
    const pathname = req.url ? parse(req.url).pathname : null;
    console.log('[WebSocket] Upgrade request for path:', pathname);

    if (pathname !== '/websocket') {
      console.log('[WebSocket] Ignoring non-websocket upgrade request');
      return;
    }

    this.wss.handleUpgrade(req, socket, head, (ws) => {
      console.log('[WebSocket] Successfully upgraded connection');
      this.wss.emit('connection', ws, req);
    });
  }
}
