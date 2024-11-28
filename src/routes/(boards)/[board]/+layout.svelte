<script lang="ts">
  import { getImageboardState } from '$lib/client/imageboard/Imageboard.svelte';
  import { getWsStore } from '$lib/stores/websocket';
  import { page } from '$app/stores';
  import { BoardService } from '$lib/client/imageboard/BoardService';
  import { onMount, setContext } from 'svelte';
  import type { BoardContext } from '$lib/types/imageboard';
  import PageTitle from '$lib/components/Heading/PageTitle.svelte';
  import Banner from '$lib/components/Heading/Banner.svelte';

  // Track which boards have been initialized
  const initializedBoards = $state(new Set<number>());

  let { children } = $props();
  const wsStore = getWsStore();
  const imageboardState = getImageboardState();

  const boardContext: BoardContext = $state({
    name: $page.params.board,
    id: BoardService.getBoardId($page.params.board)
  });

  const titleMap = {
    void: {
      title: '/v/ - void',
      subtitle: 'Reality has always been virtual.'
    },
    seams: {
      title: '/s/ - seams',
      subtitle: 'Identity is a garment waiting to be worn.'
    },
    adventures: {
      title: '/a/ - adventures',
      subtitle: 'Acceleration without destination.'
    }
  } as const;

  const pageTitle = $derived(titleMap[boardContext.name as keyof typeof titleMap]?.title ?? '');

  const pageSubtitle = $derived(
    titleMap[boardContext.name as keyof typeof titleMap]?.subtitle ?? ''
  );

  setContext('BOARD_CTX', boardContext);

  let connected = $state(false);
  wsStore.subscribe((state) => (connected = state.connected));

  // Updates boardContext when URL param changes
  $effect(() => {
    boardContext.name = $page.params.board;
    boardContext.id = BoardService.getBoardId($page.params.board);
  });

  // Handle board initialization and active board updates
  $effect(() => {
    if (boardContext.id !== null) {
      imageboardState.setActiveBoard(boardContext.id);

      // Only request content if board hasn't been initialized and we're connected
      if (connected && !initializedBoards.has(boardContext.id)) {
        wsStore.send({
          domain: 'imageboard',
          action: 'request_content',
          data: {
            boardId: boardContext.id,
            page: 1,
            limit: 5
          }
        });
        initializedBoards.add(boardContext.id);
      }
    }
  });

  onMount(() => {
    imageboardState.setActiveBoard(boardContext.id);
  });
</script>

{#if boardContext.name}
  <div class="mt-10">
    <Banner />
    <PageTitle title={pageTitle} subtitle={pageSubtitle} />
  </div>
{/if}
{@render children()}
