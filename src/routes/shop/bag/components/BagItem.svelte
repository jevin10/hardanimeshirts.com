<script lang="ts">
  import { goto } from '$app/navigation';
  import Image from '$lib/components/imageboard/post/Image.svelte';
  import type { ItemDetails } from '$lib/types/shop/state/bag';
  import type { Bag } from '$lib/types/shop/state/bag';
  import { getShopState, Shop } from '../../state/Shop.svelte';

  let {
    itemKey
  }: {
    itemKey: string;
  } = $props();

  const shopState: Shop = getShopState();
  const bag: Bag = shopState.bag;

  function gotoProduct() {
    goto(`/shop/${bag.get(itemKey)!.ProductDomain.name}/${bag.get(itemKey)!.id}`);
  }
</script>

{#if bag.get(itemKey)}
  <div class="flex flex-row gap-2 align-top">
    <img
      src={bag.get(itemKey)!.images[0]}
      alt="post"
      class="w-24 max-h-24 bg-zinc-500 border border-dotted border-black dark:border-white transition-transform"
    />
    <div class="flex flex-col items-start justify-between">
      <div>
        <button class="text-base md:text-xl" onclick={gotoProduct}>
          {bag.get(itemKey)!.name}
        </button>
        <div class="text-xs uppercase tracking-wide">
          Size: {bag.get(itemKey)!.size}
        </div>
      </div>
      <div class="text-xs uppercase font-sans">
        {bag.get(itemKey)!.price} USD
      </div>
      <button class="text-xs flex tracking-wide" onclick={() => shopState.removeFromBag(itemKey)}
        >[remove]</button
      >
    </div>
  </div>
{:else}
  <div class="text-base">Item not found</div>
{/if}
