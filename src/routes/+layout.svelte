<script lang="ts">
  import '../app.css';
  import { getWsStore, setWsStore, type WebSocketStore } from '$lib/stores/websocket';
  import { browser } from '$app/environment';
  import NavigationBar from '$lib/components/NavigationBar/NavigationBar.svelte';
  import Modal from '$lib/components/AuthModal/Modal.svelte';
  import { setPostsStore, type PostsStore } from '$lib/stores/posts';
  import { WebSocketClient } from '$lib/client/ws/WebSocketClient';
  import { onDestroy, onMount, setContext, type Snippet } from 'svelte';
  import { setImageboardState, type Imageboard } from '$lib/client/imageboard/Imageboard.svelte';
  import { setAuthModalState } from '$lib/components/AuthModal/AuthModalState.svelte';
  import type { LayoutData } from './$types';

  let { children, data }: { children: Snippet; data: LayoutData } = $props();

  const postsStore: PostsStore = setPostsStore();
  const wsStore: WebSocketStore = setWsStore();
  const imageboardState: Imageboard = setImageboardState();
  imageboardState.addPosts(data.initialPosts);
  WebSocketClient.initialize(postsStore, wsStore, imageboardState);
  setAuthModalState();

  setContext('USER_CTX', data.user);

  let connected = $state(false);
  let connectionState = $state<'connecting' | 'connected' | 'ready'>('connecting');
  let messages = $state<any[]>([]);

  const unsubscribe = wsStore.subscribe((state) => {
    connected = state.connected;
    if (state.connected && connectionState === 'connecting') {
      connectionState = 'connected';
      // Show "Connected" for 1 second before rendering main content
      setTimeout(() => {
        connectionState = 'ready';
      }, 150);
    }
    messages = state.messages;
  });

  onMount(() => {
    if (!browser) return;
    wsStore.connect();
  });

  onDestroy(() => {
    return () => {
      unsubscribe();
      wsStore.disconnect();
    };
  });
</script>

<div class="h-screen">
  {#if connectionState === 'ready'}
    <main class="h-full">
      <Modal />
      <NavigationBar />
      {@render children()}
    </main>
  {:else}
    <div class="h-screen items-center justify-center flex">
      <div>
        <div
          class="font-bold text-[clamp(2.2rem,2.2rem+0.8vw,3rem)] tracking-[clamp(-0.5px,calc(-1px-0.2vw),-3px)] text-center w-full"
        >
          hardanimeshirts.com
        </div>
        <div class="text-xl text-center">
          {#if connectionState === 'connecting'}
            Connecting to Server...
          {:else if connectionState === 'connected'}
            Connected!
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>
