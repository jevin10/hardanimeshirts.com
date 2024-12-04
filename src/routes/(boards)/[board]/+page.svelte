<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { getImageboardState } from '$lib/client/imageboard/Imageboard.svelte';
  import Thread from '$lib/components/imageboard/Thread.svelte';
  import type { BoardContext } from '$lib/types/imageboard';
  import { getWsStore } from '$lib/stores/websocket';
  import { goto } from '$app/navigation';
  import PostForm from './components/PostForm.svelte';

  const imageboardState = getImageboardState();
  const boardContext: BoardContext = getContext('BOARD_CTX');
  const wsStore = getWsStore();

  let isLoading = $state(false);
  let hasMore = $state(true);
  let bottomElement = $state<HTMLDivElement | null>(null);
  let currentObserver: IntersectionObserver | null = null;
  let postFormVisible: boolean = $state(false);

  function loadMoreThreads() {
    if (isLoading || !hasMore || boardContext.id === null || !imageboardState.activeBoard) return;

    isLoading = true;
    wsStore.send({
      domain: 'imageboard',
      action: 'request_content',
      data: {
        boardId: boardContext.id,
        page: Math.floor(imageboardState.activeBoard.threads.length / 5) + 1,
        limit: 5
      }
    });
  }

  function togglePostForm() {
    postFormVisible = !postFormVisible;
  }

  // observer for infinite loading on scroll
  function setupObserver() {
    if (currentObserver) {
      currentObserver.disconnect();
    }

    currentObserver = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoading) {
          loadMoreThreads();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px'
      }
    );

    if (bottomElement) {
      currentObserver.observe(bottomElement);
    }
  }

  function initializeState() {
    isLoading = false;
    hasMore = true;
    setupObserver();
  }

  // Effect to handle thread updates
  $effect(() => {
    const threads = imageboardState.activeBoard?.threads;
    if (threads) {
      isLoading = false;
      if (threads.length % 5 !== 0) {
        hasMore = false;
      }
    }
  });

  // Effect to handle board changes
  $effect(() => {
    if (boardContext.id !== null) {
      initializeState();
    }
  });

  // Effect to handle bottom element changes
  $effect(() => {
    if (bottomElement) {
      setupObserver();
    }
  });

  // Initialize on mount/reload
  onMount(() => {
    initializeState();

    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  });
</script>

<div class="mt-5 px-2 mx-3 border border-black dark:border-white">
  <button
    onclick={() => {
      goto(`/`);
    }}>[home]</button
  >
  <button onclick={togglePostForm}>[new post]</button>
</div>

<div class="w-full flex flex-col">
  <div class="mx-3">
    {#if boardContext.id === null}
      <p>Invalid board</p>
    {:else if imageboardState.activeBoard?.threads}
      {#if imageboardState.activeBoard.threads.length > 0}
        <div class="mt-2">
          {#if postFormVisible}
            <div class="my-5">
              {#if boardContext.name}
                <PostForm boardId={boardContext.id} boardName={boardContext.name} />
              {/if}
            </div>
          {/if}
          {#each imageboardState.activeBoard.threads as thread}
            <div class="mt-5">
              <button
                onclick={() => {
                  goto(`/${boardContext.name}/${thread.parent.id}`);
                }}
                class="w-full text-left hover:border-l-4 border-black dark:border-white hover:bg-gray-50 dark:hover:bg-zinc-950 transition-colors"
              >
                <Thread parent={thread.parent} children={thread.children} locked={thread.locked} />
              </button>
            </div>
          {/each}
        </div>
        <!-- Loading indicator -->
        {#if isLoading}
          <div class="my-5"><span class="font-bold">Loading</span> | Getting more threads...</div>
        {/if}
        <!-- Intersection observer target -->
        <div bind:this={bottomElement} class="h-px"></div>
      {:else}
        <div class="my-5"><span class="font-bold">Loading</span> | Getting Threads...</div>
      {/if}
    {:else}
      <div class="my-5"><span class="font-bold">Loading</span> | Starting Imageboard Client...</div>
    {/if}
  </div>
</div>
