import { lucia } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";
import { building } from '$app/environment';
import { GlobalThisWSS, type ExtendedGlobal } from "$lib/server/ws/WebSocketServer";
import { sequence } from "@sveltejs/kit/hooks";
import { WebSocketConnection } from "$lib/server/ws/WebSocketConnection";
import { validateSession } from "$lib/server/auth/utils/validateSession";

// WebSocket initialization middleware
let wssInitialized = false;
const clients = new Set<WebSocketConnection>();

const initializeWebSocketServer: Handle = async ({ event, resolve }) => {
  if (!wssInitialized) {
    const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
    if (wss !== undefined) {
      wss.on('connection', async (ws, req) => {
        try {
          // Get cookies from request headers
          const cookies = req.headers.cookie;
          if (!cookies) {
            console.log('[wss:kit] no cookies found, creating anonymous connection');
            new WebSocketConnection(ws, req, null);
            return;
          }

          // Parse the session cookie - assuming your session cookie is named 'auth_session'
          const sessionId = cookies
            .split(';')
            .find(c => c.trim().startsWith('auth_session='))
            ?.split('=')[1];

          if (!sessionId) {
            console.log('[wss:kit] no session cookie found, creating anonymous connection');
            new WebSocketConnection(ws, req, null);
            return;
          }

          // Validate the session using Lucia
          const { session, user } = await validateSession(sessionId);

          if (!session || !user) {
            console.log('[wss:kit] invalid session, creating anonymous connection');
            new WebSocketConnection(ws, req, null);
            return;
          }

          // Create authenticated connection
          console.log(`[wss:kit] authenticated connection for user ${user.username}`);
          new WebSocketConnection(ws, req, {
            username: user.username,
            id: user.id
          });

        } catch (error) {
          console.error('[wss:kit] error processing connection:', error);
          new WebSocketConnection(ws, req, null);
        }
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
