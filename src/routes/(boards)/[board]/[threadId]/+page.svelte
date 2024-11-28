<script lang="ts">
  import { getImageboardState } from '$lib/client/imageboard/Imageboard.svelte';
  import { getContext, onMount } from 'svelte';
  import { page } from '$app/stores';
  import Thread from '$lib/components/imageboard/Thread.svelte';
  import { goto } from '$app/navigation';
  import type { BoardContext } from '$lib/types/imageboard';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const imageboardState = getImageboardState();
  const boardContext: BoardContext = getContext('BOARD_CTX');

  function scrollToReply() {
    document.querySelector('textarea')?.scrollIntoView({ behavior: 'smooth' });
  }

  // TODO:
  // check if thread is in board
  // if not, make request for thread

  $effect(() => {
    imageboardState.activeThread;
    // set activeThread to page params
    if (data.threadId && imageboardState.activeBoard) {
      try {
        imageboardState.setActiveThread(Number(data.threadId));
      } catch (e) {
        console.log(e);
      }
    }
  });
</script>

<div class="mt-5 px-2 mx-3 border border-black dark:border-white">
  <button
    onclick={() => {
      goto(`/${boardContext.name}`);
    }}>[back]</button
  >
  <button onclick={scrollToReply}>[reply]</button>
</div>

<div class="mx-3 my-5">
  {#if imageboardState.activeThread}
    <Thread
      parent={imageboardState.activeThread.parent}
      children={imageboardState.activeThread.children}
      locked={imageboardState.activeThread.locked}
    />
    <div class="mt-2">
      <div class="text-xl">Reply</div>
      <div>
        <button>[attach image]</button>
      </div>
      <textarea
        class="w-full md:w-[40rem] border border-black dark:border-white dark:bg-black resize-none text-lg p-2"
        rows="5"
        spellcheck="false"
      ></textarea>
      <div class="w-full md:w-[40rem] flex justify-between">
        <button>[preview]</button>
        <button>[submit]</button>
      </div>
    </div>
  {:else}
    <div class="my-5"><span class="font-bold">Loading</span> | Getting post...</div>
  {/if}
</div>
