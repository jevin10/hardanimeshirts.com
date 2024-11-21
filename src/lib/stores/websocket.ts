import type { BaseWSMessage, WSMessage } from '$lib/types/ws/messages/base';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

interface WebSocketState {
  connected: boolean;
  socket: WebSocket | null;
  messages: BaseWSMessage[];
}

interface WebSocketStore {
  subscribe: Writable<WebSocketState>['subscribe'];
  connect: () => void;
  disconnect: () => void;
  send: <T extends BaseWSMessage>(message: T) => Promise<void>;
}

const WS_CTX_KEY = Symbol('WS_CTX');

export function createWebSocketStore(): WebSocketStore {
  const { subscribe, set, update } = writable<WebSocketState>({
    connected: false,
    socket: null,
    messages: []
  });

  let reconnectTimer: ReturnType<typeof setTimeout>;

  function connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/websocket`);

    ws.addEventListener('open', () => {
      update(state => ({ ...state, connected: true }));
      console.log('[websocket] connection open');
    });

    ws.addEventListener('close', () => {
      update(state => ({ ...state, connected: false, socket: null }));
      console.log('[websocket] connection closed');

      // Reconnect after delay
      clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(connect, 1000);
    });

    ws.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data) as BaseWSMessage;
        update(state => ({
          ...state,
          messages: [...state.messages, message]
        }));
      } catch (err) {
        console.error('[websocket] error parsing message:', err);
      }
    });

    update(state => ({ ...state, socket: ws }));
  }

  async function send<T extends BaseWSMessage>(message: T): Promise<void> {
    update(state => {
      if (state.socket?.readyState === WebSocket.OPEN) {
        state.socket.send(JSON.stringify(message));
      } else {
        console.warn('[websocket] Cannot send message - connection not open');
      }
      return state;
    });
  }

  function disconnect() {
    update(state => {
      state.socket?.close();
      clearTimeout(reconnectTimer);
      return { ...state, socket: null, connected: false };
    });
  }

  return {
    subscribe,
    connect,
    disconnect,
    send
  };
}

export function setWsStore(): WebSocketStore {
  const wsStore = createWebSocketStore();
  setContext(WS_CTX_KEY, wsStore);
  return wsStore;
}

export function getWsStore(): WebSocketStore {
  const store = getContext<WebSocketStore>(WS_CTX_KEY);
  if (!store) {
    throw new Error('getWsStore must be used within a component with setWsStore');
  }
  return store;
}
