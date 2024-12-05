<script lang="ts">
  import KissAnimeAd from '$lib/img/ads/KissAnime1.png';

  let flashMessage = $state('');
  let showFlash = $state(false);

  function showMessage(message: string) {
    flashMessage = message;
    showFlash = true;
    setTimeout(() => (showFlash = false), 1000);
  }
</script>

<div class="relative max-w-sm mx-auto my-8">
  <!-- Flash Message -->
  {#if showFlash}
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
      <p
        class="text-xl bg-black/80 dark:bg-white/80 text-white dark:text-black px-4 py-2 rounded-sm whitespace-nowrap"
      >
        {flashMessage}
      </p>
    </div>
  {/if}

  <!-- Top tab buttons -->
  <div class="absolute -top-[18px] right-2 flex gap-1 font-sans">
    <button
      class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
             text-[10px] px-2 py-0.5 rounded-t-sm text-gray-600 dark:text-gray-300
             border border-black dark:border-white border-b-0"
      onclick={() => showMessage('No.')}
    >
      Stop seeing this ad
    </button>
    <button
      class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
             text-[10px] px-2 py-0.5 rounded-t-sm text-gray-600 dark:text-gray-300
             border border-black dark:border-white border-b-0"
      onclick={() => showMessage('Why not?')}
    >
      Why this ad?
    </button>
  </div>

  <!-- Main container -->
  <div class="relative overflow-hidden border-black dark:border-white border">
    <img
      src={KissAnimeAd}
      alt="KissAnime: The best site to watch anime online for free!"
      class="w-full animate-bounce-zoom origin-center"
    />
  </div>

  <!-- Bottom tab button -->
  <button
    class="absolute -bottom-[18px] right-2
           bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
           text-[10px] px-2 py-0.5 rounded-b-sm text-gray-600 dark:text-gray-300
           border border-black dark:border-white border-t-0 font-sans"
    onclick={() => showMessage("Don't you dare.")}
  >
    Report this ad
  </button>
</div>

<style>
  @keyframes bounce-zoom {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  .animate-bounce-zoom {
    animation: bounce-zoom 3s infinite ease-in-out;
  }
</style>
