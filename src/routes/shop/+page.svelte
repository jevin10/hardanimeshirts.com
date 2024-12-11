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
  <div class="my-5 flex flex-col text-xs font-sans gap-1">
    <div>
      VERY IMPORTANT INFORMATION<br />
      PLEASE READ TO REDUCE CONFUSION (˶°ㅁ°)!!
    </div>
    <div>
      *all prints are unique & the images displayed<br />
      may not be the ones you receive<br />
      Shirts are printed and garments are sewn by hand one by one :)<br />
      so please be patient<br />
      as it may take up to
      <b>2 months</b> for your package to ship<br />
      Deep gratitude for your support desu :3<br />
      Please email us at
      <a href="mailto:admin@hardanimeshirts.com" class="link">admin@hardanimeshirts.com</a><br />
      with any questions about your purchase thank you!
    </div>
  </div>
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
