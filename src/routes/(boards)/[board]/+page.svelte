<script lang="ts">
  import { getWsStore } from '$lib/stores/websocket';
  import { getPostsStore } from '$lib/stores/posts';
  import { BoardService } from '$lib/client/imageboard/BoardService';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { getImageboardState } from '$lib/client/imageboard/Imageboard.svelte';
  import Content from '$lib/components/imageboard/post/Content.svelte';
  import Thread from '$lib/components/imageboard/Thread.svelte';

  const wsStore = getWsStore();
  const postsStore = getPostsStore();
  const imageboardState = getImageboardState();

  // Get board name from route params
  const boardName = $derived($page.params.board);

  // Convert board name to ID
  const boardId = $derived(BoardService.getBoardId(boardName));

  let connected = $state(false);

  const unsubscribe = wsStore.subscribe((state) => {
    connected = state.connected;
  });

  // Set active board whenever boardId changes
  $effect(() => {
    if (boardId !== null) {
      imageboardState.setActiveBoard(boardId);
      if (connected) {
        requestBoardContent();
      }
    }
  });

  function requestBoardContent() {
    console.log('requesting content');
    wsStore.send({
      domain: 'imageboard',
      action: 'request_content',
      data: {
        boardId,
        page: 1,
        limit: 5
      }
    });
  }
</script>

<div class="w-full flex flex-col">
  <div class="mx-3">
    {#if boardId === null}
      <p>Invalid board</p>
    {:else if imageboardState.activeBoard?.threads}
      {#if imageboardState.activeBoard.threads.length > 0}
        {#each imageboardState.activeBoard.threads as thread}
          <Thread parent={thread.parent} children={thread.children} locked={thread.locked} />
        {/each}
      {:else}
        <div class="my-5">populating threads...</div>
      {/if}
    {:else}
      <div class="my-5">starting imageboard...</div>
    {/if}
  </div>
</div>
