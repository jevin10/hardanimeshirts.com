<script lang="ts">
  import { getWsStore } from '$lib/stores/websocket';

  const wsStore = getWsStore();

  let connected = $state(false);

  $effect(() => {
    const unsubscribe = wsStore.subscribe((state) => {
      connected = state.connected;
    });
    return unsubscribe;
  });
</script>

<div class="relative font-times">
  <nav
    class="bg-white dark:bg-black border-b border-black dark:border-white py-1 px-1 flex justify-between items-center"
  >
    <div class="flex items-center">
      <a href="/" class="nav-link mr-2">hardanimeshirts.com</a>
      <span class="text-gray-500 mr-1">[</span>
      <a href="/void" class="nav-link mr-1">v</a>
      <span class="text-gray-500 mr-1">/</span>
      <a href="/seams" class="nav-link mr-1">s</a>
      <span class="nav-link text-gray-500 mr-1">/</span>
      <a href="/adventures" class="nav-link mr-1">a</a>
      <span class="text-gray-500 mr-1">/</span>
      <a href="/shop" class="nav-link mr-1">shop</a>
      <span class="text-gray-500">]</span>
    </div>
    <div class="nav-link flex space-x-1 items-center">
      <a href="/menu" class="nav-link">[menu]</a>
    </div>
  </nav>
  <div class="pt-1 px-1 text-xs flex justify-start bg-white dark:bg-black">
    <span class="mr-1">us-west |</span>
    {#if connected}
      <span class="text-green-500 dark:text-green-400">■ connected</span>
    {:else}
      <span class="text-red-500 dark:text-red-400">■ connecting...</span>
    {/if}
  </div>
</div>
