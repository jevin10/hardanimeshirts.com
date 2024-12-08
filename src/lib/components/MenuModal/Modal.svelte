<script lang="ts">
  import type { UserData } from '$lib/client/users/UserData.svelte';
  import { getUsersState, Users } from '$lib/client/users/Users.svelte';
  import { getMenuModalState, type MenuModalState } from './MenuModalState.svelte';

  const menuModalState: MenuModalState = getMenuModalState();
  const currentUser: UserData | null = getUsersState().currentUserData;
</script>

{#if menuModalState.isVisible}
  <div class="overlay">
    <div class="min-h-[60vh] md:h-[30rem] w-[30rem] m-5 modal flex flex-col">
      <div class="w-full border-b border-black dark:border-white flex flex-row justify-between p-1">
        <div class="text-m">Menu</div>
        <button
          type="button"
          onclick={() => {
            menuModalState.closeModal();
          }}>[x]</button
        >
      </div>
      <div class="flex-1 flex items-center justify-center">
        <div class="m-3 w-[18rem] md:w-[24-rem]">
          <div class="my-5">
            <div class="text-4xl">Menu</div>
            {#if currentUser}
              <div class="text-base">Logged in as {currentUser.id.username}</div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
