<script lang="ts">
  import Banner from './components/Banner.svelte';
  import { wsStore } from '$lib/stores/websocket';
  let messageCount = $state(0);
  let connected = $state(false);

  $effect(() => {
    const unsubscribe = wsStore.subscribe((state) => {
      connected = state.connected;
      messageCount = state.messages.length;
    });
    return unsubscribe;
  });

  function sendTestMessage() {
    wsStore.send({
      domain: 'imageboard',
      action: 'request_content',
      data: {
        boardId: null,
        page: 1,
        limit: 5
      }
    });
  }
</script>

<div class="w-full flex flex-col items-center">
  <div class="mt-10">
    <Banner />
    <div
      class="font-times text-black dark:text-white text-[clamp(2rem,1rem+2vw,3rem)] tracking-[clamp(-1px,calc(-1px-0.2vw),-3px)]"
    >
      hardanimeshirts.com
    </div>
  </div>
  <div class="mt-8 w-full max-w-2xl">
    <button
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      onclick={sendTestMessage}
    >
      Send Test Message
    </button>
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
