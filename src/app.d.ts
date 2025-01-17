import { ExtendedWebSocketServer } from "$lib/server/ws/WebSocketServer";
import type { Session } from "@prisma/client";
import 'unplugin-icons/types/svelte';

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: import("lucia").User | null;
      session: Session | null;
      wss?: ExtendedWebSocketServer;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export { };
