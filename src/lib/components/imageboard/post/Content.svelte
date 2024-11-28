<script lang="ts">
  import { BoardService } from '$lib/client/imageboard/BoardService';
  import type { posts_new } from '@prisma/client';
  import Image from './Image.svelte';
  import { goto } from '$app/navigation';
  interface HeaderProps {
    username: string;
    date: Date;
    id: number;
    parent: number | null;
    boardName: string;
  }
  interface BodyProps {
    content: string;
  }
  let { post }: { post: posts_new } = $props();
  function formatDate(date: Date | string): string {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toISOString().replace('T', ' ').slice(0, 19);
  }
  let boardName = BoardService.getBoardName(post.board_id);
</script>

{#snippet header(data: HeaderProps)}
  <span class="text-lg">
    <button
      onclick={() => {
        goto(`/profile/${data.username}`);
      }}
      class="link"
    >
      {data.username}
    </button>
  </span>
  <span class="text-xs">
    {formatDate(data.date)}
    No.{data.id}
  </span>
{/snippet}

{#snippet body(data: BodyProps)}
  <div class="min-w-0 flex-1">
    <div class="text-m break-all whitespace-pre-line overflow-hidden hyphens-auto">
      {data.content}
    </div>
  </div>
{/snippet}

<div class="flex flex-col">
  <div class="inline-block align-bottom">
    {@render header({
      username: post.user_id,
      date: post.created_at ?? new Date(),
      id: post.id,
      parent: post.parent_id,
      boardName
    })}
  </div>
  <div class="flex flex-row gap-2">
    {#if post.image_url}
      <div class="flex-shrink-0">
        <Image url={post.image_url} />
      </div>
    {/if}
    {@render body({
      content: post.content
    })}
  </div>
</div>
