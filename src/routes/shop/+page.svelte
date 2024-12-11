<script lang="ts">
  import SortDropdown from './components/SortDropdown.svelte';
  import { SortDropdown as SortDropdownState } from './state/SortDropdown.svelte';
  import { setShopState, Shop } from './state/Shop.svelte';
  import Product from './components/Product.svelte';
  import type { ClothingProduct } from '$lib/types/shop/product/product';

  const shopState: Shop = setShopState();
  const sortDropdownState: SortDropdownState = shopState.sortDropdownState;

  const testProduct: ClothingProduct = {
    id: 1,
    domain: 1,
    createdAt: new Date(),
    name: 'lainchan tee shirt',
    price: 80,
    description: `"At least now you’re free to become anything you want. No, I guess you were actually free all along."`,

    images: [
      'https://pbs.twimg.com/media/Gdow7jGWMAAl8iB?format=jpg&name=large',
      'https://lainchan.org/static/lain_banner1.png',
      'https://lainchan.org/static/buck3.jpg'
    ],
    categories: ['shirt'],
    available: true,
    ProductDomain: {
      id: 1,
      name: 'clothing'
    },
    ClothingData: {
      id: 1,
      size: 'M',
      measurements: {
        chest: { value: 20, unit: 'in' },
        waist: { value: 10, unit: 'in' },
        shoulders: { value: 20, unit: 'in' }
      },
      quantity: 300
    }
  };
</script>

<SortDropdown />
<div class="mt-2">
  <div class="my-5">
    <Product product={testProduct} />
  </div>
</div>
