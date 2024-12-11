<script lang="ts">
  import Banner from '$lib/components/Heading/Banner.svelte';
  import PageTitle from '$lib/components/Heading/PageTitle.svelte';
  import { onMount, type Snippet } from 'svelte';
  import CartIcon from '~icons/ion/bag-sharp';
  import { getShopState, Shop } from './state/Shop.svelte';
  import { goto } from '$app/navigation';

  let { children }: { children: Snippet } = $props();
  const shopState: Shop = getShopState();
</script>

<div class="my-10 mx-3">
  <Banner />
  <PageTitle title={'shop'} subtitle={'Beauty is genius. Style is brilliance.'} />
  <div class="mt-5 px-2 border border-black dark:border-white flex flex-row justify-between">
    <button
      onclick={() => {
        history.back();
      }}>[back]</button
    >
    <div class="flex flex-row gap-2">
      <button
        class="flex flex-row items-center gap-1"
        onclick={() => {
          goto('/shop/bag');
        }}>[<CartIcon class="h-4 w-4 " />]</button
      >
    </div>
  </div>
  <div class="my-5">
    {@render children()}
  </div>
</div>
