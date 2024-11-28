<script lang="ts">
  import { page } from '$app/stores';

  interface Props {
    boardId: number;
    boardName: string;
  }

  let { boardId, boardName }: Props = $props();
</script>

<div class="w-full md:w-[25rem]">
  <div class="text-xl text-bold">New Post</div>
  <button>[attach image]</button>
  <div class="grid grid-cols-4 gap-1 mt-1">
    <div class="border border-dotted border-black dark:border-white flex justify-end px-1">
      Name
    </div>
    <div class="col-span-3 border px-1"></div>
    <div class="border border-dotted border-black dark:border-white flex justify-end px-1">
      Content
    </div>
    <textarea
      class="col-span-3 border text-lg border-black dark:border-white px-1 dark:bg-black"
      rows="5"
      spellcheck="false"
    ></textarea>
    <div class="border border-dotted border-black dark:border-white flex justify-end px-1">
      Captcha
    </div>
    <div class="col-span-3 px-1">Captcha</div>
  </div>
  <div class="w-full md:w-[25rem] flex justify-start gap-1 mt-1">
    <button>[submit]</button>
    <button>[preview]</button>
  </div>
</div>
