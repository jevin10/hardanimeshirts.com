import { lucia } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";
import { building } from '$app/environment';
import { GlobalThisWSS, WebSocketManager, type ExtendedGlobal } from "$lib/server/ws/WebSocketServer";

let wssInitialized = false;

const startupWebsocketServer = () => {
    if (wssInitialized) return;
    console.log('[wss:kit] setup');
    
    const manager = WebSocketManager.getInstance();
    manager.initialize();
    wssInitialized = true;
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

