import { ExtendedServer } from './src/lib/server/ws/WebSocketServer';
import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import type { ViteDevServer } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    Icons({
      compiler: 'svelte'
    }),
    {
      name: 'webSocketServer',
      configureServer(server: ViteDevServer) {
        const extendedServer = ExtendedServer.getInstance();
        server.httpServer?.on('upgrade', (req, socket, head) => {
          extendedServer.handleUpgrade(req, socket, head);
        });

        server.httpServer?.on('close', () => {
          const wss = extendedServer['wss'];
          wss?.close();
        });
      }
    }
  ]
});
