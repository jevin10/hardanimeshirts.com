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
  import ClothesImage from '$lib/img/bannerimages/clothes.png';
  import BlogImage from '$lib/img/bannerimages/blog.png';
  import GeneralImage from '$lib/img/bannerimages/general.png';
  import MikuImage from '$lib/img/bannerimages/mikuevent.png';
  import HomeGif from '$lib/img/has_top_25.gif';
  import SantaHat from '$lib/img/santaHat.png';

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

  const specialRoutes = new Map([
    ['/void', GeneralImage],
    ['/seams', ClothesImage],
    ['/adventures', BlogImage],
    ['/miku', MikuImage],
    ['/miku/results', MikuImage]
  ]);

  onMount(() => {
    [...homeImages, ...specialRoutes.values()].forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    intervalId = setInterval(() => {
      currentImageIndex = (currentImageIndex + 1) % homeImages.length;
    }, 5000);
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });

  $: currentImage = specialRoutes.get($page.url.pathname) || homeImages[currentImageIndex];
</script>

<div class="relative border-none bg-transparent p-0">
  <img
    class="block mx-auto h-40 md:h-48 border-2 border-black dark:invert"
    src={currentImage}
    alt="She only loves me for my hard anime shirts."
  />
  <img
    src={SantaHat}
    alt="Santa Hat"
    class="absolute top-[-1.5rem] right-[-1.1rem] w-25 h-20 md:w-30 md:h-30"
  />
</div>
