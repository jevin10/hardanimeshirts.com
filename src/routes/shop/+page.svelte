<script lang="ts">
  import SortDropdown from './components/SortDropdown.svelte';
  import { SortDropdown as SortDropdownState } from './state/SortDropdown.svelte';
  import { getShopState, Shop } from './state/Shop.svelte';
  import Product from './components/Product.svelte';
  import { goto } from '$app/navigation';
  import LoadingIcon from '~icons/eos-icons/bubble-loading';

  const shopState: Shop = getShopState();
  const sortDropdownState: SortDropdownState = shopState.sortDropdownState;
  const products = $derived(Array.from(shopState.products.values()));
</script>

<SortDropdown />
<div class="mt-2">
  {#if products.length === 0}
    <div class="my-5 flex flex-row items-center">
      <div class="text-xl">Opening the store</div>
      <LoadingIcon class="w-5 h-5 mx-2" />
    </div>
  {/if}

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
