<script lang="ts">
  import type { ThreadProps } from '$lib/client/imageboard/Thread.svelte';
  import Content from './post/Content.svelte';
  import Image from './post/Image.svelte';
  let { parent, children, locked }: ThreadProps = $props();
</script>

<div class="my-5 border-black dark:border-white border-l px-3">
  <div class="mb-2">
    <Content post={parent} />
  </div>
  <div class="flex flex-col items-start">
    {#each children as child}
      <div class="border border-black dark:border-white my-1 p-2 max-w-fit">
        <Content post={child} />
      </div>
    {/each}
  </div>
</div>
