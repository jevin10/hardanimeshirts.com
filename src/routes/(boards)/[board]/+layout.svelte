<script lang="ts">
  import { getImageboardState } from '$lib/client/imageboard/Imageboard.svelte';
  import { getPostsStore } from '$lib/stores/posts';
  import { getWsStore } from '$lib/stores/websocket';
  import { page } from '$app/stores';
  import { BoardService } from '$lib/client/imageboard/BoardService';
  import { setContext } from 'svelte';
  import type { BoardContext } from '$lib/types/imageboard';

  let { children } = $props();

  const wsStore = getWsStore();
  const postsStore = getPostsStore();
  const imageboardState = getImageboardState();

  const boardContext: BoardContext = $state({
    name: $page.params.board,
    id: BoardService.getBoardId($page.params.board)
  });

  setContext('BOARD_CTX', boardContext);

  let connected = $state(false);
  wsStore.subscribe((state) => (connected = state.connected));

  // updates boardContext
  $effect(() => {
    boardContext.name = $page.params.board;
    boardContext.id = BoardService.getBoardId($page.params.board);
  });

  // updates activeBoard
  $effect(() => {
    if (boardContext.id !== null) {
      imageboardState.setActiveBoard(boardContext.id);
      if (connected) {
        wsStore.send({
          domain: 'imageboard',
          action: 'request_content',
          data: {
            boardId: boardContext.id,
            page: 1,
            limit: 5
          }
        });
      }
    }
  });
</script>

{@render children()}
