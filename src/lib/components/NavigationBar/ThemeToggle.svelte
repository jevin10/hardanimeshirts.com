<script lang="ts">
  import { onMount } from 'svelte';
  import SunnyIcon from '~icons/line-md/sunny-outline-loop';
  import MoonIcon from '~icons/line-md/moon-alt-loop';

  let isDark = true;
  let mounted = false;

  onMount(() => {
    mounted = true;
    const stored = localStorage.getItem('theme');
    isDark = stored ? stored === 'dark' : true;
    updateTheme();
  });

  function toggleTheme() {
    isDark = !isDark;
    updateTheme();
  }

  function updateTheme() {
    if (!mounted) return;

    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
</script>

<button on:click={toggleTheme} aria-label="Toggle theme" class="flex flex-row items-center">
  <span class="inline-block">[</span>
  {#if isDark}
    <SunnyIcon class="h-4 w-4" />
  {:else}
    <MoonIcon class="h-4 w-4" />
  {/if}
  <span class="inline-block">]</span>
</button>
