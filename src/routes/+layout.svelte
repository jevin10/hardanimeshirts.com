<script lang="ts">
  import '../app.css';
  import { getWsStore, setWsStore, type WebSocketStore } from '$lib/stores/websocket';
  import { browser } from '$app/environment';
  import NavigationBar from '$lib/components/NavigationBar/NavigationBar.svelte';
  import { setPostsStore, type PostsStore } from '$lib/stores/posts';
  import { WebSocketClient } from '$lib/client/ws/WebSocketClient';
  import { onDestroy, onMount } from 'svelte';

  // set up global stores and wsClient
  const postsStore: PostsStore = setPostsStore();
  const wsStore: WebSocketStore = setWsStore();
  const wsClient = WebSocketClient.initialize(postsStore, wsStore);

  let { children } = $props();

  let connected = $state(false);
  let messages = $state<any[]>([]);

  const unsubscribe = wsStore.subscribe((state) => {
    connected = state.connected;
    messages = state.messages;
  });

  onMount(() => {
    // Runs after component initialization
    if (!browser) return;

    // Connect when component mounts
    wsStore.connect();
  });

  onDestroy(() => {
    // Cleanup when component unmounts
    return () => {
      unsubscribe();
      wsStore.disconnect();
    };
  });
</script>

<div class="h-screen">
  <NavigationBar />
  <main class="h-full">
    {@render children()}
  </main>
</div>
