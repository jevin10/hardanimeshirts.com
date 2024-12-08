<script lang="ts">
  import { page } from '$app/stores';
  import type { UserData } from '$lib/client/users/UserData.svelte';
  import { getUsersState, Users } from '$lib/client/users/Users.svelte';
  import Content from '$lib/components/imageboard/post/Content.svelte';
  import { getContext } from 'svelte';

  const usersState: Users = getUsersState();

  let userData: UserData | undefined = $state(undefined);

  $effect(() => {
    userData = usersState.users.get($page.params.username);
  });
</script>

<div>
  {#if userData}
    {userData.id.username} says:
    <div class="border border-black dark:border-white p-2 max-w-fit text-lg">
      {#if userData.posts.length > 0}
        {userData.posts[0].content}
      {:else}
        I'm a lurker!
      {/if}
    </div>
  {/if}
</div>
