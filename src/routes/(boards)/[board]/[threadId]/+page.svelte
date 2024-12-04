<script lang="ts">
  import { getImageboardState } from '$lib/client/imageboard/Imageboard.svelte';
  import { getContext, onMount } from 'svelte';
  import { page } from '$app/stores';
  import Thread from '$lib/components/imageboard/Thread.svelte';
  import { goto } from '$app/navigation';
  import type { BoardContext } from '$lib/types/imageboard';
  import type { PageData } from './$types';
  import { getWsStore } from '$lib/stores/websocket';
  import type { ImageboardMessage } from '$lib/types/ws/messages/imageboard';
  import type { User } from 'lucia';

  let { data }: { data: PageData } = $props();

  const imageboardState = getImageboardState();
  const boardContext: BoardContext = getContext('BOARD_CTX');
  const wsStore = getWsStore();
  const user: User | null = getContext('USER_CTX');

  let formData = $state({
    content: '',
    imageUrl: null
  });

  function scrollToReply() {
    document.querySelector('textarea')?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleKeydown(event: KeyboardEvent) {
    // Submit on Enter but not if Shift is held (allow Shift+Enter for newlines)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent newline from being added
      createReply();
    }
  }

  function createReply() {
    if (boardContext.id === null || !imageboardState.activeThread) return;

    wsStore.send<ImageboardMessage>({
      domain: 'imageboard',
      action: 'create_post',
      data: {
        userId: user?.id ?? '',
        username: user?.username ?? 'Anonymous',
        boardId: boardContext.id,
        content: formData.content,
        imageUrl: null,
        parentId: imageboardState.activeThread.parent.id
      }
    });

    formData = {
      content: '',
      imageUrl: null
    };
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

<div class="mx-3 mt-5 pb-5">
  {#if imageboardState.activeThread}
    <Thread
      parent={imageboardState.activeThread.parent}
      children={imageboardState.activeThread.children}
      locked={imageboardState.activeThread.locked}
      expanded={true}
    />
    <div class="mt-2">
      <div class="text-xl">New Reply</div>
      <div>
        <button>[attach image]</button>
      </div>
      <textarea
        bind:value={formData.content}
        onkeydown={handleKeydown}
        class="w-full md:w-[40rem] border border-black dark:border-white dark:bg-black resize-none text-lg p-2 leading-none"
        rows="5"
        spellcheck="false"
      ></textarea>
      <div class="w-full md:w-[40rem] flex justify-start gap-1">
        <button onclick={createReply}> [submit] </button>
      </div>
    </div>
  {:else}
    <div class="my-5"><span class="font-bold">Loading</span> | Getting post...</div>
  {/if}
</div>
