<script lang="ts">
  import { BoardService } from '$lib/client/imageboard/BoardService';
  import type { posts_new } from '@prisma/client';
  import Image from './Image.svelte';
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
  <div class="text-sm">
    <a href="/profile/{data.username}">{data.username}</a>
    {formatDate(data.date)}
    No.{data.id}
    {#if data.parent}
      <div class="text-xs ms-2">
        ﹂reply to <a href="/{data.boardName}/{data.parent}">{data.parent}</a>
      </div>
    {/if}
  </div>
{/snippet}

{#snippet body(data: BodyProps)}
  <div class="min-w-0 flex-1">
    <div class="text-sm mt-1 break-all whitespace-pre-line overflow-hidden hyphens-auto">
      {data.content}
    </div>
  </div>
{/snippet}

<div class="flex flex-col">
  {@render header({
    username: post.user_id,
    date: post.created_at ?? new Date(),
    id: post.id,
    parent: post.parent_id,
    boardName
  })}
  <div class="flex flex-row gap-2 align-top">
    {#if post.image_url}
      <div class="mt-1 flex-shrink-0">
        <Image url={post.image_url} />
      </div>
    {/if}
    {@render body({
      content: post.content
    })}
  </div>
</div>
