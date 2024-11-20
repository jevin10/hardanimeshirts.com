<script lang="ts">
  import Banner from './components/Banner.svelte';
  import { wsStore } from '$lib/stores/websocket';

  let messageCount = $state(0);
  let connected = $state(false);

  // Handle websocket state changes
  $effect(() => {
    connected = $wsStore.connected;
    messageCount = $wsStore.messages.length;
  });

  // Initial data fetch
  $effect(() => {
    if (connected) {
      wsStore.send({
        domain: 'imageboard',
        action: 'request_content',
        data: {
          boardId: null,
          page: 1,
          limit: 3
        }
      });
    }
  });
</script>

<div class="w-full flex flex-col items-center">
  <div class="mt-10">
    <Banner />
    <div
      class="font-times text-black dark:text-white text-[clamp(2rem,1rem+1vw,3rem)] tracking-[clamp(-0.5px,calc(-1px-0.2vw),-3px)] text-center w-full"
    >
      hardanimeshirts.com
    </div>
  </div>
  <div class="mt-8 w-full max-w-2xl">
    <div class="mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
      <h2 class="text-lg font-semibold mb-2">Messages ({messageCount}):</h2>
      {#each $wsStore.messages as message}
        <div class="bg-white dark:bg-gray-700 p-3 rounded mb-2">
          <strong class="text-blue-500">{message.action}:</strong>
          <pre class="mt-1 text-sm whitespace-pre-wrap break-words">{JSON.stringify(
              message.data,
              null,
              2
            )}</pre>
        </div>
      {/each}
    </div>
  </div>
</div>
