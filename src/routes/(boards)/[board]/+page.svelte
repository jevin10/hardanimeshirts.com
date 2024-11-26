<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { getImageboardState } from '$lib/client/imageboard/Imageboard.svelte';
  import Thread from '$lib/components/imageboard/Thread.svelte';
  import type { BoardContext } from '$lib/types/imageboard';

  const imageboardState = getImageboardState();

  const boardContext: BoardContext = getContext('BOARD_CTX');
</script>

<div class="w-full flex flex-col">
  <div class="mx-3">
    {#if boardContext.id === null}
      <p>Invalid board</p>
    {:else if imageboardState.activeBoard?.threads}
      {#if imageboardState.activeBoard.threads.length > 0}
        {#each imageboardState.activeBoard.threads as thread}
          <Thread parent={thread.parent} children={thread.children} locked={thread.locked} />
        {/each}
      {:else}
        <div class="my-5"><span class="text-bold">Loading</span> | Getting Threads...</div>
      {/if}
    {:else}
      <div class="my-5"><span class="text-bold">Loading</span> | Starting Imageboard Client...</div>
    {/if}
  </div>
</div>
