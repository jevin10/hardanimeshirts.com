import type { ExtendedWebSocketServer } from "$lib/server/ws/WebSocketServer";

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: import("lucia").User | null;
      session: import("lucia").Session | null;
      wss?: ExtendedWebSocketServer;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export { };
