<script lang="ts">
  import { getImageboardState } from '$lib/client/imageboard/Imageboard.svelte';
  import { getWsStore } from '$lib/stores/websocket';
  import { page } from '$app/stores';
  import { BoardService } from '$lib/client/imageboard/BoardService';
  import { setContext } from 'svelte';
  import type { BoardContext } from '$lib/types/imageboard';
  import PageTitle from '$lib/components/Heading/PageTitle.svelte';
  import Banner from '$lib/components/Heading/Banner.svelte';

  let { children } = $props();

  const wsStore = getWsStore();
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

  const titleMap = {
    void: {
      title: '/v/ - void',
      subtitle: 'Reality has always been virtual.'
    },
    seams: {
      title: '/s/ - seams',
      subtitle: 'The body is obsolete. Your garments are your shell.'
    },
    adventures: {
      title: '/a/ - adventures',
      subtitle: 'Acceleration without destination!'
    }
  } as const;

  const pageTitle = $derived(titleMap[boardContext.name as keyof typeof titleMap]?.title ?? '');
  const pageSubtitle = $derived(
    titleMap[boardContext.name as keyof typeof titleMap]?.subtitle ?? ''
  );
</script>

{#if boardContext.name}
  <div class="mt-10">
    <Banner />
    <PageTitle title={pageTitle} subtitle={pageSubtitle} />
  </div>
{/if}
{@render children()}
