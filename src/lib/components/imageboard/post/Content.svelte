<script lang="ts">
  import { BoardService } from '$lib/client/imageboard/BoardService';
  import type { posts_new } from '@prisma/client';

  interface HeaderProps {
    username: string;
    date: Date;
    id: number;
  }

  interface BodyProps {
    parent: number | null;
    boardName: string;
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
  </div>
{/snippet}

{#snippet body(data: BodyProps)}
  <div>
    <div class="text-xs">
      {#if data.parent}
        <div class="ms-2">
          ﹂reply to <a href="/{boardName}/{data.parent}">{data.parent}</a> in
          <a href="/{boardName}">{boardName}</a>
        </div>
      {/if}
    </div>
    <div class="text-sm mt-1">
      {data.content}
    </div>
  </div>
{/snippet}

{@render header({
  username: post.user_id,
  date: post.created_at ?? new Date(),
  id: post.id
})}

{@render body({
  parent: post.parent_id,
  boardName,
  content: post.content
})}
