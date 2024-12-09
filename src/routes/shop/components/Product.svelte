<script lang="ts">
  import type { Outerwear, Pants, Shirt } from '$lib/types/shop/product/clothing';
  import type { Snippet } from 'svelte';

  interface ProductProps {
    product: Shirt | Pants | Outerwear;
    purchaseButton: Snippet;
  }

  let { product, purchaseButton }: ProductProps = $props();
</script>
