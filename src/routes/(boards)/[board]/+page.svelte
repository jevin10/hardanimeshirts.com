<script lang="ts">
  import { getWsStore } from '$lib/stores/websocket';
  import { getPostsStore } from '$lib/stores/posts';
  import { BoardService } from '$lib/client/imageboard/BoardService';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { getImageboardState } from '$lib/client/imageboard/Imageboard.svelte';

  const wsStore = getWsStore();
  const postsStore = getPostsStore();
  const imageboardState = getImageboardState();

  // Get board name from route params
  const boardName = $derived($page.params.board);

  // Convert board name to ID
  const boardId = $derived(BoardService.getBoardId(boardName));

  // Request content on mount
  onMount(() => {
    if (boardId !== null) {
      requestBoardContent();
    }
  });

  function requestBoardContent() {
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
{:else}
  <!-- Your board content here -->
{/if}
