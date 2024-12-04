<script lang="ts">
  import type { ThreadProps } from '$lib/client/imageboard/Thread.svelte';
  import Content from './post/Content.svelte';
  import Image from './post/Image.svelte';

  let { parent, children, locked, expanded }: ThreadProps & { expanded: boolean } = $props();

  // Calculate omitted replies and visible children
  let visibleChildren = $derived(expanded ? children : children.slice(-4));

  let omitted = $derived(expanded ? 0 : Math.max(0, children.length - 4));
</script>

<div class="border-black dark:border-white border-l-2 px-3">
  <div class="mb-2">
    <Content post={parent} />
    {#if !expanded && omitted > 0}
      <div class="italic mt-1 font-bold">
        {omitted}
        {omitted === 1 ? 'reply' : 'replies'} omitted. Click to expand
      </div>
    {/if}
  </div>
  <div class="flex flex-col items-start">
    {#each visibleChildren as child}
      <div class="border border-black dark:border-white my-1 p-2 max-w-fit">
        <Content post={child} />
      </div>
    {/each}
  </div>
</div>
