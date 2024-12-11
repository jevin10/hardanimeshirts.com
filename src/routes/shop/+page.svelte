<script lang="ts">
  import SortDropdown from './components/SortDropdown.svelte';
  import { SortDropdown as SortDropdownState } from './state/SortDropdown.svelte';
  import { getShopState, setShopState, Shop } from './state/Shop.svelte';
  import Product from './components/Product.svelte';
  import type { ClothingProduct } from '$lib/types/shop/product/product';
  import { goto } from '$app/navigation';

  const shopState: Shop = getShopState();
  const sortDropdownState: SortDropdownState = shopState.sortDropdownState;
  const products = $derived(Array.from(shopState.products.values()));
</script>

<SortDropdown />
<div class="mt-2">
  {#each products as product}
    <div class="my-5">
      <button
        onclick={() => {
          goto(`/shop/clothing/${product.id}`);
        }}
        class="w-full text-left hover:border-l-4 border-black dark:border-white hover:bg-gray-50 dark:hover:bg-zinc-950 transition-colors"
      >
        <Product {product} />
      </button>
    </div>
  {/each}
</div>
