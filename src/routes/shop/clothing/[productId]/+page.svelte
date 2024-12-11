<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import type { ClothingProduct } from '$lib/types/shop/product/product';
  import Product from '../../components/Product.svelte';
  import { getShopState, type Shop } from '../../state/Shop.svelte';

  let { data }: { data: PageData } = $props();

  const shopState: Shop = getShopState();

  let product = $state<ClothingProduct | undefined>(shopState.getProduct(data.productId));
  let loading = $state(true);
  let error = $state<string | null>(null);
</script>

<div class="space-y-4">
  {#if product}
    <Product {product} expanded={true} />
  {:else}
    <div class="text-gray-600">No product found</div>
  {/if}
</div>
