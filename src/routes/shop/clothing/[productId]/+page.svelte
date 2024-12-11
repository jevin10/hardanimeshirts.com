<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import type { ClothingProduct } from '$lib/types/shop/product/product';
  import Product from '../../components/Product.svelte';
  import { getShopState, type Shop } from '../../state/Shop.svelte';
  import LoadingIcon from '~icons/eos-icons/bubble-loading';
  import SadFace from '~icons/clarity/sad-face-solid';

  let { data }: { data: PageData } = $props();

  const shopState: Shop = getShopState();

  let product = $derived<ClothingProduct | undefined>(shopState.getProduct(data.productId));
  let loading = $state(true);
  let error = $state<string | null>(null);
</script>

<div class="space-y-4">
  {#if product}
    <Product {product} expanded={true} />
  {:else if !shopState.initialized}
    <div class="my-5 flex flex-row items-center">
      <div class="text-xl">Getting product</div>
      <LoadingIcon class="w-5 h-5 mx-2" />
    </div>
  {:else if shopState.initialized}
    <div class="my-5 flex flex-row items-center">
      <div class="text-xl">No product found</div>
      <SadFace class="w-5 h-5 mx-2" />
    </div>
  {/if}
</div>
