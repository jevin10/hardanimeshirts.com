<script lang="ts">
  import type { Bag } from '$lib/types/shop/state/bag';
  import { getShopState, type Shop } from '../state/Shop.svelte';

  const shopState: Shop = getShopState();
  const bag: Bag = shopState.bag;

  shopState.bag.forEach((item) => {
    console.log('item in bag');
  });
</script>

<div class="text-3xl">Shopping Bag</div>
{#if bag.size === 0}
  <div class="text-base">Bag is empty!</div>
{/if}
