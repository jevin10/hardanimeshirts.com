import { WebSocketManager } from './src/lib/server/ws/WebSocketServer';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import type { ViteDevServer } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: 'webSocketServer',
			configureServer(server: ViteDevServer) {
				const manager = WebSocketManager.getInstance();
				server.httpServer?.on('upgrade', (req, socket, head) => {
					manager.handleUpgrade(req, socket, head);
				});

				server.httpServer?.on('close', () => {
					const wss = manager['wss'];
					wss?.close();
				});
			}
		}
	]
});
