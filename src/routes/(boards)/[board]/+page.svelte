<script lang="ts">
  import { getWsStore } from '$lib/stores/websocket';
  import { getPostsStore } from '$lib/stores/posts';
  import { BoardService } from '$lib/client/imageboard/BoardService';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { getImageboardState } from '$lib/client/imageboard/Imageboard.svelte';
  import Content from '$lib/components/imageboard/post/Content.svelte';

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

{#if boardId === null}
  <p>Invalid board</p>
{:else if imageboardState.activeBoard?.threads}
  {#each imageboardState.activeBoard.threads as thread}
    <Content post={thread.parent} />
  {/each}
{/if}
