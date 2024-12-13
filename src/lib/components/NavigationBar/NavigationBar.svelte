<script lang="ts">
  import { page } from '$app/stores';
  import { getWsStore } from '$lib/stores/websocket';
  import { goto } from '$app/navigation';
  import { getAuthModalState } from '../AuthModal/AuthModalState.svelte';
  import { getContext } from 'svelte';
  import type { User } from '@prisma/client';
  import ThemeToggle from './ThemeToggle.svelte';
  import { getMenuModalState } from '../MenuModal/MenuModalState.svelte';

  const wsStore = getWsStore();
  const authModalState = getAuthModalState();
  const menuModalState = getMenuModalState();
  let connected = $state(false);

  let user: User | null = getContext('USER_CTX');

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

  async function handleSignOut() {
    try {
      const response = await fetch('/api/signout', {
        method: 'POST'
      });

      if (response.ok) {
        // redirect
        window.location.href = '/';
      } else {
        // Handle error case
        console.error('Signout failed');
      }
    } catch (error) {
      console.error('Signout error:', error);
    }
  }
</script>

<div class="relative font-times">
  <nav
    class="bg-white dark:bg-black border-b border-black dark:border-white py-1 px-1 flex justify-between items-center"
  >
    <div class="flex items-center">
      <button class="nav-link mr-2 text-sm md:text-base" onclick={() => navigate('/')}>
        hardanimeshirts.com
      </button>
      <span class="text-gray-500 mr-1 text-sm md:text-base">[</span>
      <button
        class="nav-link mr-1 text-sm md:text-base {isActive('/void') ? 'underline' : ''}"
        onclick={() => navigate('/void')}
      >
        v
      </button>
      <span class="text-gray-500 mr-1 text-sm md:text-base">/</span>
      <button
        class="nav-link mr-1 text-sm md:text-base {isActive('/seams') ? 'underline' : ''}"
        onclick={() => navigate('/seams')}
      >
        s
      </button>
      <span class="text-gray-500 mr-1 text-sm md:text-base">/</span>
      <button
        class="nav-link mr-1 text-sm md:text-base {isActive('/adventures') ? 'underline' : ''}"
        onclick={() => navigate('/adventures')}
      >
        a
      </button>
      <span class="text-gray-500 mr-1 text-sm md:text-base">/</span>
      <button
        class="nav-link mr-1 text-sm md:text-base {isActive('/shop') ? 'underline' : ''}"
        onclick={() => navigate('/shop')}
      >
        shop
      </button>
      <span class="text-gray-500 text-sm md:text-base">]</span>
    </div>

    <div class="nav-link flex space-x-1 items-center text-sm md:text-base">
      <ThemeToggle />
      <button class="nav-link" onclick={() => menuModalState.openModal()}> [menu] </button>
    </div>
  </nav>

  <div class="flex flex-row justify-between pt-1 px-1 text-xs md:text-sm bg-white dark:bg-black">
    <div class="flex justify-start">
      <span class="mr-1">client | </span>
      {#if connected}
        <span class="text-green-500 dark:text-green-400"
          >■
          <button
            class="underline"
            onclick={() => {
              goto('/event/lain/inbox');
            }}
          >
            wired
          </button>
        </span>
      {:else}
        <span class="text-red-500 dark:text-red-400">■ connecting...</span>
      {/if}
    </div>
    <div>
      {#if user}
        You are browsing as <button class="link" onclick={() => goto(`/profile/${user.username}`)}>
          {user.username}
        </button>
        |
        <button class="link" onclick={handleSignOut}>Sign out</button>
      {:else}
        You are browsing as a guest. |
        <button class="link" onclick={() => authModalState.openModal()}> Sign in </button>
      {/if}
    </div>
  </div>
</div>
