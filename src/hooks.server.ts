import { lucia } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";
import { createWSSGlobalInstance, GlobalThisWSS } from '$lib/server/webSocketUtils';
import type { ExtendedGlobal, ExtendedWebSocket } from '$lib/server/webSocketUtils';
import { building } from '$app/environment';
import type { RawData } from 'ws';

interface WSMessage {
	type: string;
	data: unknown;
}

let wssInitialized = false;

const startupWebsocketServer = () => {
	if (wssInitialized) return;
	console.log('[wss:kit] setup');

	// Create WSS instance if it doesn't exist
	if (!(globalThis as ExtendedGlobal)[GlobalThisWSS]) {
		createWSSGlobalInstance();
	}

	const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];

	if (wss !== undefined) {
		// Add any global WebSocket event handlers here
		wss.on('connection', (ws: ExtendedWebSocket) => {
			console.log(`[wss:kit] client connected`);

			// Send welcome message
			ws.send(JSON.stringify({
				type: 'welcome',
				data: { timestamp: new Date().toISOString() }
			}));

			// Handle incoming messages
			ws.on('message', (data: RawData) => {
				try {
					const message = JSON.parse(data.toString()) as WSMessage;
					console.log('[wss:kit] received message:', message);

					// Echo the message back to the client
					ws.send(JSON.stringify({
						type: 'server-response',
						data: {
							originalMessage: message,
							serverTimestamp: new Date().toISOString()
						}
					}));

				} catch (err) {
					console.error('[wss:kit] error parsing message:', err);
				}
			});

			ws.on('close', () => {
				console.log(`[wss:kit] client disconnected`);
			});
		});

		wssInitialized = true;
	}
};

export const handle: Handle = async ({ event, resolve }) => {
	startupWebsocketServer();

	// Skip WebSocket server when pre-rendering pages
	if (!building) {
		const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
		if (wss !== undefined) {
			event.locals.wss = wss;
		}
	}

	if (event.url.pathname.startsWith('/api')) {
		console.log('API route hit');
		return resolve(event);
	}

	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		// sveltekit types deviates from the de-facto standard
		// you can use 'as any' too
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;

	const response = await resolve(event, {
		filterSerializedResponseHeaders: name => name === 'content-type'
	});

	return response;
};

