<script lang="ts">
  import Content from '$lib/components/imageboard/post/Content.svelte';
  import { BoardService } from '$lib/client/imageboard/BoardService';
  import type { posts_new } from '@prisma/client';

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

  let post = $state(posts[0]);
  let boardName = $derived(BoardService.getBoardName(post.board_id));
</script>

<div class="flex flex-row justify-between items-end">
  <div class="text-3xl">Latest Posts</div>
  <div class="text-sm">
    as discovered in <a href="/{boardName}" class="">/{boardName}/</a>
  </div>
</div>
<div class="h-32 border border-black dark:border-white p-1">
  <Content {post} />
</div>
