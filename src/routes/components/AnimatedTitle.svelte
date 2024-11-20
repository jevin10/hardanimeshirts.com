<script lang="ts">
  const FULL_TEXT = 'hardanimeshirts?????????? HARDANIMESHIRTS?????????? ';
  const WINDOW_SIZE = 10;

  let currentIndex = $state(0);

  let currentTitle = $derived(
    (FULL_TEXT + FULL_TEXT).slice(currentIndex, currentIndex + WINDOW_SIZE)
  );

  $effect(() => {
    const timer = setInterval(() => {
      currentIndex = (currentIndex + 1) % FULL_TEXT.length;
    }, 50);

    return () => clearInterval(timer);
  });
</script>

<svelte:head>
  <title>{currentTitle}</title>
</svelte:head>
