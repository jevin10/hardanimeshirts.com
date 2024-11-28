<script lang="ts">
  import Content from '$lib/components/imageboard/post/Content.svelte';
  import { BoardService } from '$lib/client/imageboard/BoardService';
  import type { posts_new } from '@prisma/client';
  import { goto } from '$app/navigation';

  const placeholder: posts_new[] = [
    {
      id: 1,
      user_id: '1owroller',
      board_id: 1,
      parent_id: null,
      content: 'test',
      created_at: new Date(),
      latest_activity: new Date(),
      image_url: null
    }
  ];

  let { posts = placeholder }: { posts: posts_new[] } = $props();
  let postIndex = $state(0);
  let post = $derived(posts[postIndex]);
  let isLoading = $derived(!post || post.board_id === undefined);
  let boardName = $derived(isLoading ? '' : BoardService.getBoardName(post.board_id));
</script>

{#snippet navButton(index: number)}
  {#if postIndex === index - 1}
    <button class="font-bold" disabled={isLoading}>{index}</button>
  {:else}
    <button onclick={() => (postIndex = index - 1)} disabled={isLoading}>
      {index}
    </button>
  {/if}
{/snippet}

<div class="flex flex-row justify-between items-end">
  <div class="text-3xl">Latest Posts</div>
  {#if isLoading}
    <div class="text-sm">
      <button>loading thread</button>
    </div>
  {:else if !isLoading}
    <div class="text-sm">
      <button
        class="link"
        onclick={() => {
          goto(`/${boardName}/${post.parent_id ?? post.id}`);
        }}>view full thread</button
      >
    </div>
  {/if}
</div>

<div class="relative h-32 border border-black dark:border-white p-1">
  {#if isLoading}
    <div class="flex items-center justify-center h-full">
      <div class="animate-pulse text-gray-500">Loading...</div>
    </div>
  {:else if !post}
    <div class="flex items-center justify-center h-full">
      <div class="text-red-500">No posts available</div>
    </div>
  {:else}
    <div class="relative h-full overflow-hidden">
      <!-- Scrollable content -->
      <div
        class="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/20 dark:scrollbar-thumb-white/20"
      >
        <Content {post} />
      </div>
      <!-- Fade overlay -->
      <div
        class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-black to-transparent pointer-events-none"
      ></div>
    </div>
  {/if}
</div>

<div class="flex flex-row justify-between">
  <div class="flex flex-row space-x-1">
    {#if posts?.length}
      {#each posts as _, index}
        {@render navButton(index + 1)}
      {/each}
    {/if}
  </div>
  {#if !isLoading && boardName}
    <div class="text-sm">
      as discovered in
      <button
        onclick={() => {
          goto(`/${boardName}`);
        }}
        class="link"
      >
        /{boardName}/
      </button>
    </div>
  {/if}
</div>
