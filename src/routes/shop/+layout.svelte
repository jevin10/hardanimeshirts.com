<script lang="ts">
  import Banner from '$lib/components/Heading/Banner.svelte';
  import PageTitle from '$lib/components/Heading/PageTitle.svelte';
  import { onMount, type Snippet } from 'svelte';
  import CartIcon from '~icons/ion/bag-sharp';
  import { getShopState, Shop } from './state/Shop.svelte';
  import { goto } from '$app/navigation';
  import LocationSelector from './components/LocationSelector.svelte';
  import type { PageData } from '../$types';

  let { children, data }: { children: Snippet; data: PageData } = $props();
  const shopState: Shop = getShopState();
</script>

<div class="my-10 mx-3">
  <Banner />
  <PageTitle title={'shop'} subtitle={"This isn't streetwear. This is neetwear."} />
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
  <LocationSelector />
  <div class="my-5">
    {#if data.user}
      {@render children()}
    {:else}
      <div class="text-xl">The shop is members-only.</div>
      <div class="text-base my-1">
        If you would like an invite code, the easiest way to get one is to ask somebody that you
        know who has it.
      </div>
      <div class="text-base mt-5">
        If you really want to get in... there's a way. <br />
        hardanimeshirts.com is an endless rabbithole. There's more to this website than meets the eye
        ;)
      </div>
    {/if}
  </div>
</div>
