<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import background from '$lib/img/event/lain/background.jpg';
  import { afterNavigate } from '$app/navigation';

  let { children }: { children: Snippet } = $props();

  afterNavigate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
</script>

<div
  class="bg-black w-full h-screen mt-1 overflow-hidden bg-cover bg-center bg-no-repeat"
  style="background-image: url('{background}')"
>
  {@render children()}
</div>
