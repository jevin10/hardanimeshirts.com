<script lang="ts">
  import { onMount } from 'svelte';
  import coplandImage from '$lib/img/copland.gif';

  let isVisible = $state(false);

  onMount(() => {
    isVisible = true;
  });
</script>

<div class="w-full h-screen flex items-center justify-center relative">
  {#if isVisible}
    <img src={coplandImage} alt="Copland OS" class="w-[30rem]" />
  {/if}
  <div class="absolute top-4 left-4 md:top-8 md:left-8 text-white"></div>

  <div class="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-white">
    <div class="mb-5">
      <div class="font-century italic text-2xl md:text-4xl">Copland OS Enterprise</div>
      Product by Tachibana Lab
    </div>
    <div class="mb-2 text-sm tracking-wider">Starting OS...</div>
    <div class="loading-bar-container">
      <div class="loading-bar"></div>
    </div>
  </div>
</div>

<style>
  .loading-bar-container {
    width: 200px;
    height: 20px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(0, 255, 255, 0.5);
    padding: 2px;
    border-radius: 3px;
    box-shadow:
      0 0 10px rgba(0, 255, 255, 0.3),
      inset 0 0 10px rgba(0, 255, 255, 0.1),
      0 2px 5px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(5px);
    position: relative;
    /* Remove overflow: hidden to allow glow to show outside container */
  }

  .loading-bar-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
    border-radius: 2px 2px 0 0;
  }

  .loading-bar {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, rgba(0, 114, 255, 0.8), rgba(0, 255, 255, 0.8));
    border-radius: 2px;
    animation:
      loading 3s ease-in-out forwards,
      glow 1.5s ease-in-out infinite alternate;
    position: relative;
    /* Add z-index to ensure glow is visible */
    z-index: 1;
  }

  .loading-bar::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1));
    border-radius: 2px 2px 0 0;
  }

  @keyframes loading {
    0% {
      width: 0%;
    }
    15% {
      width: 10%;
    }
    25% {
      width: 12%;
    }
    35% {
      width: 40%;
    }
    45% {
      width: 43%;
    }
    55% {
      width: 46%;
    }
    65% {
      width: 75%;
    }
    75% {
      width: 76%;
    }
    85% {
      width: 77%;
    }
    90% {
      width: 85%;
    }
    95% {
      width: 95%;
    }
    100% {
      width: 95%;
    }
  }

  @keyframes glow {
    from {
      box-shadow:
        0 0 5px rgba(255, 255, 255, 0.5),
        0 0 10px rgba(255, 255, 255, 0.3),
        0 0 15px rgba(255, 255, 255, 0.2);
    }
    to {
      box-shadow:
        0 0 10px rgba(255, 255, 255, 0.7),
        0 0 20px rgba(255, 255, 255, 0.5),
        0 0 30px rgba(255, 255, 255, 0.3);
    }
  }
</style>
