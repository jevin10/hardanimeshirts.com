import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import type { ViteDevServer } from 'vite';
import { WebSocketManager } from './src/lib/server/ws/WebSocketServer';

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

				// Cleanup on close
				server.httpServer?.on('close', () => {
					const wss = manager['wss']; // Access private property for cleanup
					wss?.close();
				});
			}
		}
	]
});
