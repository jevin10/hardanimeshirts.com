<script lang="ts">
  import Banner from './components/Banner.svelte';
  import LatestPosts from './components/LatestPosts.svelte';
  import { getImageboardState } from '$lib/client/imageboard/Imageboard.svelte';
  import Stage from './components/Stage.svelte';

  const imageboardState = getImageboardState();

  console.log('sending request');

  let newPosts = imageboardState.getPosts().slice(0, 3);
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
    <div class="mx-5 space-y-2">
      <div>
        <Stage />
      </div>
      <div>
        <LatestPosts posts={newPosts} />
      </div>
    </div>
  </div>
</div>
