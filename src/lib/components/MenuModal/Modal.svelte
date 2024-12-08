<script lang="ts">
  import type { UserData } from '$lib/client/users/UserData.svelte';
  import { getUsersState, Users } from '$lib/client/users/Users.svelte';
  import { getMenuModalState, type MenuModalState } from './MenuModalState.svelte';
  import Invite from './pages/Invite.svelte';

  const menuModalState: MenuModalState = getMenuModalState();
  const currentUser: UserData | null = getUsersState().currentUserData;

  const inviteCode: string = $state('xxxxx-xxxxx-xxxxx');
</script>

{#snippet mainPage()}
  <div class="text-4xl">Main Menu</div>
  <div class="my-5 flex flex-col w-full items-start text-xl">
    <div class="text-xs tracking-widest my-1 uppercase">info</div>
    <button>policies</button>
    <div class="my-5 w-full flex flex-col items-start">
      <div class="text-xs tracking-widest my-1 uppercase">extras</div>
      {#if currentUser}
        <button onclick={() => (menuModalState.page = 'Invite')}>invite others</button>
      {/if}
      <button>toggle ads</button>
    </div>
  </div>
{/snippet}

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
          <div class="my-5 h-[20rem]">
            {#if menuModalState.page === 'Main'}
              {@render mainPage()}
            {:else if menuModalState.page === 'Invite'}
              <Invite />
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
