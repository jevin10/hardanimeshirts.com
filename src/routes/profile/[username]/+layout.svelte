<script lang="ts">
  import type { Snippet } from 'svelte';
  import { page } from '$app/stores';
  import { getUsersState, type Users } from '$lib/client/users/Users.svelte';
  import type { LayoutData } from './$types';

  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  const usersState: Users = getUsersState();
</script>

<div class="mt-10 mx-5">
  <div class="text-3xl">{$page.params.username}</div>
  <div class="text-xl">
    {data.profile.userId}
  </div>
  <button onclick={() => history.back()}>Back</button>
  {@render children()}
</div>
