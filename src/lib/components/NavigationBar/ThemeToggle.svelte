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

<button on:click={toggleTheme} aria-label="Toggle theme" class="flex flex-row items-end gap-1">
  <span class="inline-block">[</span>
  {#if isDark}
    <MoonIcon class="h-5 w-5" />
  {:else}
    <SunnyIcon class="h-5 w-5" />
  {/if}
  <span class="inline-block">]</span>
</button>
