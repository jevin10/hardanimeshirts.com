<script lang="ts">
  import { onMount, setContext, type Snippet } from 'svelte';
  import { page } from '$app/stores';
  import { getUsersState, type Users } from '$lib/client/users/Users.svelte';
  import { getWsStore, type WebSocketStore } from '$lib/stores/websocket';
  import { calculateCurrentLevelProgress } from '$lib/shared/user/levelCalculations';
  import type { RequestProgressMessage, RequestUserDataMessage } from '$lib/types/ws/messages/user';
  import type { UserData } from '$lib/client/users/UserData.svelte';
  import type { LevelProgress } from '$lib/types/user/progress';
  import { formatRelativeTime } from '$lib/utils/formatRelativeTime';

  let { children }: { children: Snippet } = $props();
  const usersState: Users = getUsersState();
  const wsStore: WebSocketStore = getWsStore();
  let userData: UserData | undefined = $state(usersState.users.get($page.params.username));

  // Derived values for XP progress
  let progress = $derived<LevelProgress>(
    userData !== undefined
      ? calculateCurrentLevelProgress(userData.progress.currentXp)
      : { currentLevelXp: 0, xpBetweenLevels: 0 }
  );

  let progressPercentage = $derived(
    progress ? (progress.currentLevelXp / progress.xpBetweenLevels) * 100 : 0
  );

  wsStore.send<RequestUserDataMessage>({
    domain: 'user',
    action: 'request_user_data',
    data: { username: $page.params.username }
  });

  wsStore.send<RequestProgressMessage>({
    domain: 'user',
    action: 'request_progress',
    data: { username: $page.params.username }
  });

  $effect(() => {
    userData = usersState.users.get($page.params.username);
  });
</script>

<div class="mt-5 px-2 mx-3 border border-black dark:border-white">
  <button onclick={() => history.back()}>[back]</button>
</div>

<div class="mx-5 mt-5">
  {#if userData}
    <div class="text-3xl">{$page.params.username}</div>
    <div class="text-sm italic">
      Last seen:
      {#if userData.posts[0].latest_activity}
        {formatRelativeTime(userData.posts[0].latest_activity)}
      {:else}
        loading...
      {/if}
    </div>
    <div class="my-1 font-sans">
      <div class="text-sm">
        Level {userData.progress.level}
      </div>
      <div class="max-w-sm h-1.1 border border-black dark:border-white">
        <div
          class="bg-black dark:bg-white h-1 transition-all duration-500"
          style="width: {progressPercentage}%"
        ></div>
      </div>
      <div class="text-xs mt-1">
        {progress?.currentLevelXp.toLocaleString()}/{progress?.xpBetweenLevels.toLocaleString()} XP
      </div>
    </div>

    {@render children()}
  {:else}
    <div class="text-xl">Loading profile...</div>
  {/if}
</div>
