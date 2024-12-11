<script lang="ts">
  import type { Bag } from '$lib/types/shop/state/bag';
  import { getContext } from 'svelte';
  import { getShopState, type Shop } from '../state/Shop.svelte';
  import BagItem from './components/BagItem.svelte';
  import type { User } from 'lucia';

  const user: User | null = getContext('USER_CTX');

  const shopState: Shop = getShopState();
  const bag: Bag = shopState.bag;

  const bagItems = $derived([...bag.keys()]);
  const subtotal = $derived.by(() => {
    let total = 0;
    bag.forEach((bagItem) => {
      total += bagItem.price;
    });
    return total;
  });
  const shipping = $derived.by(() => {
    if (subtotal > 150) {
      return 'Free';
    } else {
      return '???';
    }
  });
</script>

<div class="flex flex-col-reverse md:flex-row justify-between place-items-start">
  <div class="my-3 md:my-0">
    <div class="text-3xl mb-3">Shopping Bag</div>
    {#if bag.size !== 0}
      {#each bagItems as itemKey, index}
        <div class="my-5">
          <BagItem {itemKey} />
        </div>
      {/each}
    {:else}
      <div class="text-base">Bag is empty!</div>
    {/if}
  </div>
  {#if bag.size !== 0}
    <div class="flex flex-col items-start md:items-end gap-2 md:my-3">
      <div class="flex-col flex items-start">
        <div class="mb-2">
          <div class="text-sm">Subtotal: ${subtotal}.00</div>
          <div class="text-sm">Shipping: {shipping}</div>
          <div class="text-sm">Total: ${subtotal}.00</div>
        </div>
        <button class="text-sm px-3 py-1 text-white bg-black dark:text-black dark:bg-white"
          >Proceed to checkout</button
        >
      </div>
      <div class="text-xs italic md:text-end">
        Shipping and taxes are estimated at checkout.
        <br />
        Free shipping on orders above $150 USD.
      </div>
    </div>
  {/if}
</div>
