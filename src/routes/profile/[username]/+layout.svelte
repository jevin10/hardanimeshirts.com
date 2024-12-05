<script lang="ts">
  import type { Snippet } from 'svelte';
  import { page } from '$app/stores';

  let { children }: { children: Snippet } = $props();
</script>

<div class="mt-10 mx-5">
  <div class="text-3xl">{$page.params.username}</div>
  <button onclick={() => history.back()}>Back</button>
  {@render children()}
</div>
