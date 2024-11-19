import { parse } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { nanoid } from 'nanoid';
import type { IncomingMessage } from 'http';
import type { Duplex } from 'stream';

export const GlobalThisWSS = Symbol.for('sveltekit.wss');

export interface ExtendedWebSocket extends WebSocket {
    socketId: string;
}

export type ExtendedWebSocketServer = WebSocketServer;

export type ExtendedGlobal = typeof globalThis & {
    [GlobalThisWSS]: ExtendedWebSocketServer;
};

export const onHttpServerUpgrade = (req: IncomingMessage, sock: Duplex, head: Buffer) => {
    const pathname = req.url ? parse(req.url).pathname : null;
    console.log('[WebSocket] Upgrade request for path:', pathname);

    if (pathname !== '/websocket') {
        console.log('[WebSocket] Ignoring non-websocket upgrade request');
        return;
    }

    const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
    if (!wss) {
        console.error('[WebSocket] No WebSocket server instance found');
        return;
    }

    wss.handleUpgrade(req, sock, head, (ws) => {
        console.log('[WebSocket] Successfully upgraded connection');
        wss.emit('connection', ws as ExtendedWebSocket, req);
    });
};

export const createWSSGlobalInstance = () => {
    console.log('[WebSocket] Creating new WSS instance');

    if ((globalThis as ExtendedGlobal)[GlobalThisWSS]) {
        console.log('[WebSocket] WSS instance already exists');
        return (globalThis as ExtendedGlobal)[GlobalThisWSS];
    }

    const wss = new WebSocketServer({ noServer: true });
    (globalThis as ExtendedGlobal)[GlobalThisWSS] = wss;

    wss.on('connection', (ws: WebSocket) => {
        (ws as ExtendedWebSocket).socketId = nanoid();
        console.log(`[WebSocket] Client connected (${(ws as ExtendedWebSocket).socketId})`);

        ws.on('error', (error) => {
            console.error(`[WebSocket] Error:`, error);
        });

        ws.on('close', (code, reason) => {
            console.log(`[WebSocket] Client disconnected (${(ws as ExtendedWebSocket).socketId})`);
            console.log(`[WebSocket] Close code: ${code}, reason: ${reason}`);
        });
    });

    return wss;
};
