<script lang="ts">
  import { page } from '$app/stores';
  import type { User } from 'lucia';
  import { getContext } from 'svelte';

  const user: User | null = getContext('USER_CTX');

  interface Props {
    boardId: number;
    boardName: string;
  }

  let { boardId, boardName }: Props = $props();
</script>

<div class="w-full md:w-[25rem]">
  <div class="grid grid-cols-4 gap-1 mt-1">
    <div
      class="text-xl text-bold border border-black dark:border-white col-span-4 p-1 flex justify-center"
    >
      New Post
    </div>
    <div class="border border-black dark:border-white flex justify-end px-1">Name</div>
    <div class="col-span-3 border border-black dark:border-white px-1">
      {user?.username ?? 'Anonymous'}
    </div>
    <div class="border border-black dark:border-white flex justify-end px-1">Image</div>
    <button class="col-span-3 border border-black dark:border-white px-1 flex justify-start">
      [attach image]
    </button>
    <div class="border border-black dark:border-white flex justify-end px-1">Content</div>
    <textarea
      class="col-span-3 border text-lg border-black dark:border-white px-1 dark:bg-black"
      rows="5"
      spellcheck="false"
    ></textarea>
    <div class="border border-black dark:border-white flex justify-end px-1">Captcha</div>
    <div class="col-span-3 px-1 border border-black dark:border-white">Captcha</div>
  </div>
  <button
    class="w-full md:w-[25rem] border border-black dark:border-white flex justify-center gap-1 mt-1"
  >
    [submit]
  </button>
</div>
