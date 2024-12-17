<script lang="ts">
  import { onMount } from 'svelte';
  import CopyIcon from '~icons/tabler/copy';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let showTooltip: boolean = $state(false);

  async function copyToClipboard() {
    try {
      if (!data.inviteCode) {
        throw new Error('No invite code!');
      }
      await navigator.clipboard.writeText(data.inviteCode);
      showTooltip = true;
      setTimeout(() => {
        showTooltip = false;
      }, 2000); // Hide tooltip after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
</script>

<div class="text-xl">Thank you for your purchase!</div>
<div class="text-base my-1">
  Here's an invite code associated with your order. If you already own one, feel free to give it to
  your mom or something.<br />
  <span class="font-bold">Please note:</span> This is the only time you will be able to view the invite
  code. Please copy it down somewhere safe before you use it.
</div>
<div class="w-full md:w-48 my-5">
  {#if data.inviteCode}
    <div class="text-xs uppercase tracking-widest">Invite code</div>
    <div
      class="border border-black dark:border-white p-1 mb-2 flex justify-between items-center relative"
    >
      <span>{data.inviteCode}</span>
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
  {:else}
    ERROR
  {/if}
</div>
<div class="text-xl">Next Steps</div>
<div class="my-1">
  If you don't have an account already, sign up with your invite code.<br />
  <span class="font-bold">Hint:</span> Top right
</div>
