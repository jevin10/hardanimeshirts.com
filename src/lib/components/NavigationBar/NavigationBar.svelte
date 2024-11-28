<script lang="ts">
  import { page } from '$app/stores';
  import { getWsStore } from '$lib/stores/websocket';
  import { goto } from '$app/navigation';

  const wsStore = getWsStore();
  let connected = $state(false);

  $effect(() => {
    const unsubscribe = wsStore.subscribe((state) => {
      connected = state.connected;
    });
    return unsubscribe;
  });

  function navigate(path: string) {
    goto(path);
  }

  function isActive(path: string) {
    return $page.url.pathname.startsWith(path);
  }
</script>

<div class="relative font-times">
  <nav
    class="bg-white dark:bg-black border-b border-black dark:border-white py-1 px-1 flex justify-between items-center"
  >
    <div class="flex items-center">
      <button class={`nav-link mr-2`} onclick={() => navigate('/')}> hardanimeshirts.com </button>
      <span class="text-gray-500 mr-1">[</span>
      <button
        class={`nav-link mr-1 ${isActive('/void') ? 'underline' : ''}`}
        onclick={() => navigate('/void')}
      >
        v
      </button>
      <span class="text-gray-500 mr-1">/</span>
      <button
        class={`nav-link mr-1 ${isActive('/seams') ? 'underline' : ''}`}
        onclick={() => navigate('/seams')}
      >
        s
      </button>
      <span class="nav-link text-gray-500 mr-1">/</span>
      <button
        class={`nav-link mr-1 ${isActive('/adventures') ? 'underline' : ''}`}
        onclick={() => navigate('/adventures')}
      >
        a
      </button>
      <span class="text-gray-500 mr-1">/</span>
      <button
        class={`nav-link mr-1 ${isActive('/shop') ? 'underline' : ''}`}
        onclick={() => navigate('/shop')}
      >
        shop
      </button>
      <span class="text-gray-500">]</span>
    </div>
    <div class="nav-link flex space-x-1 items-center">
      <button
        class={`nav-link ${isActive('/menu') ? 'underline' : ''}`}
        onclick={() => navigate('/menu')}
      >
        [menu]
      </button>
    </div>
  </nav>
  <div class="pt-1 px-1 text-xs flex justify-start bg-white dark:bg-black">
    <span class="mr-1">server | </span>
    {#if connected}
      <span class="text-green-500 dark:text-green-400">■ connected</span>
    {:else}
      <span class="text-red-500 dark:text-red-400">■ connecting...</span>
    {/if}
  </div>
</div>
