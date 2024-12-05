<script lang="ts">
  import type { Snippet } from 'svelte';
  import { page } from '$app/stores';
  import { getUsersState, type Users } from '$lib/client/users/Users.svelte';
  import type { LayoutData } from './$types';
  import { getWsStore, type WebSocketStore } from '$lib/stores/websocket';
  import type { RequestUserDataMessage } from '$lib/types/ws/messages/user';
  import type { UserData } from '$lib/client/users/UserData.svelte';

  let { children }: { children: Snippet } = $props();

  const usersState: Users = getUsersState();
  const wsStore: WebSocketStore = getWsStore();

  wsStore.send<RequestUserDataMessage>({
    domain: 'user',
    action: 'request_user_data',
    data: {
      username: $page.params.username
    }
  });

  let userData: UserData | undefined = $state(undefined);
  $effect(() => {
    console.log('Running effect');
    userData = usersState.users.get($page.params.username);
  });
</script>

<div class="mt-10 mx-5">
  <div class="text-3xl">{$page.params.username}</div>
  {#if userData}
    <div class="text-xl">
      {userData.id.userId}
    </div>
  {/if}
  <button onclick={() => history.back()}>Back</button>
  {@render children()}
</div>
