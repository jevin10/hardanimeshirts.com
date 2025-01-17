import * as path from 'path';
import * as url from 'url';
import { ExtendedServer } from './src/lib/server/ws/WebSocketServer';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extendedServer = ExtendedServer.getInstance();

const { server } = await import(path.resolve(__dirname, './build/index.js'));

server.server.on('upgrade', (req, socket, head) => {
	extendedServer.handleUpgrade(req, socket, head);
});
