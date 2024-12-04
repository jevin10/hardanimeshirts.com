import { lucia } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";
import { building } from '$app/environment';
import { GlobalThisWSS, type ExtendedGlobal } from "$lib/server/ws/WebSocketServer";
import { sequence } from "@sveltejs/kit/hooks";
import { WebSocketConnection } from "$lib/server/ws/WebSocketConnection";
import { validateSession } from "$lib/server/auth/utils/validateSession";
import { WebSocketManager } from "$lib/server/ws/WebSocketManager";

// WebSocket initialization middleware
let wssInitialized = false;

const initializeWebSocketServer: Handle = async ({ event, resolve }) => {
  if (!wssInitialized) {
    const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
    const wsManager = WebSocketManager.getInstance();

    if (wss !== undefined) {
      wss.on('connection', async (ws, req) => {
        wsManager.handleNewConnection(ws, req);
      });
      wssInitialized = true;
    }
  }

  if (!building) {
    const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
    if (wss !== undefined) {
      event.locals.wss = wss;
    }
  }

  const result = await resolve(event, {
    filterSerializedResponseHeaders: name => name === 'content-type'
  });
  return result;
};

// API route handling middleware
const handleApiRoutes: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/api')) {
    console.log('API route hit');
    const result = await resolve(event);
    return result;
  }

  const result = await resolve(event);
  return result;
};

// Authentication middleware
const handleAuthentication: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get(lucia.sessionCookieName);

  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    const result = await resolve(event);
    return result;
  }

  const { session, user } = await validateSession(sessionId);

  if (session && Date.now() < session.expiresAt.getTime()) {
    const sessionCookie = lucia.createSessionCookie(session.id);
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

  const result = await resolve(event);
  return result;
};

// Combine middleware in sequence
export const handle = sequence(
  handleAuthentication,
  initializeWebSocketServer,
  handleApiRoutes,
);
