<script lang="ts">
  import Banner from './components/Banner.svelte';
  import { wsStore } from '$lib/client/ws/wsStore';
  import LatestPosts from './components/LatestPosts.svelte';

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

<svelte:head>
  <title>hardanimeshirts.com</title>
  <meta
    name="description"
    content="“Blessed Are the Weebs, for They Will Inherit the Earth“ (Giatt 5:5)"
  />
  <meta
    name="keywords"
    content="anime clothing, anime streetwear, anime shirts, japanese streetwear, anime imageboard"
  />
  <meta name="robots" content="index, follow" />
</svelte:head>

<div class="w-full flex flex-col items-center">
  <div class="mt-10">
    <Banner />
    <div
      class="font-bold text-[clamp(2.2rem,2.2rem+0.8vw,3rem)] tracking-[clamp(-0.5px,calc(-1px-0.2vw),-3px)] text-center w-full"
    >
      hardanimeshirts.com
    </div>
  </div>
  <div class="mt-2 w-full max-w-3xl">
    <div class="p-4">
      <LatestPosts />
      {#each $wsStore.messages as message}
        <div class="p-3 rounded mb-2">
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
