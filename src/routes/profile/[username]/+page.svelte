<script lang="ts">
  import { page } from '$app/stores';
  import type { UserData } from '$lib/client/users/UserData.svelte';
  import { getUsersState, Users } from '$lib/client/users/Users.svelte';
  import { getContext } from 'svelte';

  const usersState: Users = getUsersState();

  let userData: UserData | undefined = $state(undefined);

  $effect(() => {
    userData = usersState.users.get($page.params.username);
  });
</script>

<div>
  {#if userData}
    {JSON.stringify(userData.posts)}
  {/if}
</div>
