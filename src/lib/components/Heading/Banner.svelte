<script lang="ts">
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import BeautifulShirtsImage from '$lib/img/bannerimages/beautifulshirts.png';
  import FaintPrintImage from '$lib/img/bannerimages/faintprint.png';
  import FullGraphicImage from '$lib/img/bannerimages/fullgraphic.png';
  import HardRnImage from '$lib/img/bannerimages/hardrn.png';
  import NiceShirtImage from '$lib/img/bannerimages/niceshirt.png';
  import ReallyGoesHardImage from '$lib/img/bannerimages/reallygoeshard.png';
  import SoldOutImage from '$lib/img/bannerimages/soldout.png';
  import SunKenImage from '$lib/img/bannerimages/sunken.png';
  import HomeGif from '$lib/img/has_top_25.gif';

  const homeImages: string[] = [
    HomeGif,
    BeautifulShirtsImage,
    HomeGif,
    FaintPrintImage,
    HomeGif,
    FullGraphicImage,
    HomeGif,
    HardRnImage,
    HomeGif,
    NiceShirtImage,
    HomeGif,
    ReallyGoesHardImage,
    HomeGif,
    SoldOutImage,
    HomeGif,
    SunKenImage
  ];

  let currentImageIndex = 0;
  let intervalId: ReturnType<typeof setInterval>;

  onMount(() => {
    [...homeImages].forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    intervalId = setInterval(() => {
      currentImageIndex = (currentImageIndex + 1) % homeImages.length;
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });

  $: currentImage = homeImages[currentImageIndex];
</script>

<div class="border-none bg-transparent p-0">
  <img
    class="block mx-auto h-40 md:h-48 border-2 border-black dark:invert"
    src={currentImage}
    alt="She only loves me for my hard anime shirts."
  />
</div>
