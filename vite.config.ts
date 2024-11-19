import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import type { ViteDevServer } from 'vite';
import { WebSocketServer } from 'ws';
import { onHttpServerUpgrade } from './src/lib/server/webSocketUtils';

export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: 'webSocketServer',
			configureServer(server: ViteDevServer) {
				const wss = new WebSocketServer({ noServer: true });
				server.httpServer?.on('upgrade', onHttpServerUpgrade);

				// Cleanup on close
				server.httpServer?.on('close', () => {
					wss.close();
				});
			}
		}
	]
});
