<script lang="ts">
  import SortDropdown from './components/SortDropdown.svelte';
  import { SortDropdown as SortDropdownState } from './state/SortDropdown.svelte';
  import { setShopState, Shop } from './state/Shop.svelte';
  import type { Shirt } from '$lib/types/shop/product/clothing';

  const shopState: Shop = setShopState();
  const sortDropdownState: SortDropdownState = shopState.sortDropdownState;
</script>

<SortDropdown />
