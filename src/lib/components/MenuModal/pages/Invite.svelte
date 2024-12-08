<script lang="ts">
  import CopyIcon from '~icons/tabler/copy';
  import type { UserData } from '$lib/client/users/UserData.svelte';
  import { getUsersState } from '$lib/client/users/Users.svelte';
  import { getMenuModalState, type MenuModalState } from '../MenuModalState.svelte';

  const currentUser: UserData | null = getUsersState().currentUserData;
  const menuModalState: MenuModalState = getMenuModalState();
  let inviteCode: string = $state('xxxxx-xxxxx-xxxxx');
  let errorMessage: string | null = $state(null);
  let showTooltip: boolean = $state(false);

  async function generateCode() {
    try {
      inviteCode = 'generating...';
      const response = await fetch('/api/auth/code', {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error('Failed to generate invite code');
      }
      const data = await response.json();
      inviteCode = data.code;
      errorMessage = null;
    } catch (err) {
      console.error(err);
      inviteCode = 'xxxxx-xxxxx-xxxxx';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        errorMessage = 'Unknown error occurred. Could not generate invite code!';
      }
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(inviteCode);
      showTooltip = true;
      setTimeout(() => {
        showTooltip = false;
      }, 2000); // Hide tooltip after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
</script>

{#if currentUser}
  <button
    onclick={() => {
      menuModalState.page = 'Main';
    }}>[back]</button
  >
  <div class="flex flex-col gap-[3rem]">
    <div>
      <div class="text-lg my-1">Invite responsibly.</div>
      <div class="text-sm">
        With great power comes great responsibility. To ensure the quality of our board, please
        refrain from inviting any normies.
      </div>
    </div>
    <div>
      <div class="text-xs uppercase tracking-widest">Invite code</div>
      <div
        class="border border-black dark:border-white p-1 mb-2 flex justify-between items-center relative"
      >
        <span>{inviteCode}</span>
        <button onclick={copyToClipboard} class="relative" aria-label="Copy invite code">
          <CopyIcon class="h-5 w-5" />
          {#if showTooltip}
            <div
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm whitespace-nowrap"
            >
              Copied!
            </div>
          {/if}
        </button>
      </div>
      <button onclick={generateCode} class="text-2xl">[generate]</button>
    </div>
    {#if errorMessage}
      <div class="my-5">
        <div class="text-m text-red-400">{errorMessage}</div>
      </div>
    {/if}
  </div>
{/if}
