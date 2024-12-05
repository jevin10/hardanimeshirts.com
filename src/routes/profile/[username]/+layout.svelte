<script lang="ts">
  import type { Snippet } from 'svelte';
  import { page } from '$app/stores';
  import { getUsersState, type Users } from '$lib/client/users/Users.svelte';

  let { children }: { children: Snippet } = $props();

  const usersState: Users = getUsersState();
</script>

<div class="mt-10 mx-5">
  <div class="text-3xl">{$page.params.username}</div>
  {#if usersState.currentUserData}
    <div class="text-xl">{usersState.currentUserData.id.userId}</div>
    <div class="text-sm">{JSON.stringify(usersState.currentUserData.posts)}</div>
  {/if}
  <button onclick={() => history.back()}>Back</button>
  {@render children()}
</div>
