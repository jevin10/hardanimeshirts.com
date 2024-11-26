<script lang="ts">
  import Banner from './components/Banner.svelte';
  import { getWsStore } from '$lib/stores/websocket';
  import { getPostsStore } from '$lib/stores/posts';
  import type { posts_new } from '@prisma/client';
  import LatestPosts from './components/LatestPosts.svelte';
  import { getImageboardState } from '$lib/client/imageboard/Imageboard.svelte';

  const wsStore = getWsStore();
  const postsStore = getPostsStore();

  let latestPosts = $derived.by(() => {
    const allPosts: posts_new[] = [];

    if (!$postsStore.threads.length && !$postsStore.orphans.length) {
      return [];
    }

    for (const thread of $postsStore.threads) {
      allPosts.push(thread.parent);
      allPosts.push(...thread.children);
    }
    allPosts.push(...$postsStore.orphans);

    const sortedPosts = allPosts
      .sort((a, b) => {
        const dateA = a.latest_activity ? new Date(a.latest_activity) : new Date(0);
        const dateB = b.latest_activity ? new Date(b.latest_activity) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 3);

    return sortedPosts;
  });

  // Add effect to track latestPosts changes
  $effect(() => {
    console.log('latestPosts changed:', latestPosts);
  });

  function test() {
    wsStore.send({
      domain: 'imageboard',
      action: 'request_content',
      data: {
        boardId: null,
        page: 1,
        limit: 5
      }
    });
  }
</script>

<svelte:head>
  <title>hardanimeshirts.com</title>
  <meta
    name="description"
    content="“Blessed Are the Weebs, for They Will Inherit the Earth“ (Giatt 5:5)"
  />
  <meta
    name="keywords"
    content="anime clothing, anime streetwear, anime shirts, japanese streetwear, anime imageboard"
  />
  <meta name="robots" content="index, follow" />
</svelte:head>

<div class="w-full flex flex-col items-center">
  <div class="mt-10">
    <Banner />
    <div
      class="font-bold text-[clamp(2.2rem,2.2rem+0.8vw,3rem)] tracking-[clamp(-0.5px,calc(-1px-0.2vw),-3px)] text-center w-full"
    >
      hardanimeshirts.com
    </div>
  </div>
  <div class="mt-2 w-full max-w-3xl">
    <div class="mx-5">
      <LatestPosts posts={latestPosts} />
    </div>
  </div>
</div>
