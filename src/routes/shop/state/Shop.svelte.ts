import { SvelteMap } from 'svelte/reactivity';
import type { SortCategory, SortProduct } from "$lib/types/shop/product/sort";
import { v4 } from 'uuid';
import { getContext, setContext } from "svelte";
import { SortDropdown } from "./SortDropdown.svelte";
import type { ClothingProduct } from "$lib/types/shop/product/product";
import { createBagKey, type Bag, type ItemDetails, type ItemId } from '$lib/types/shop/state/bag';
import type { SizeInfo } from '$lib/types/shop/product/clothing';
import type { Country } from '$lib/shared/locations/countries';

export class Shop {
  initialized: boolean = $state(false);
  sortDropdownState: SortDropdown;
  products: SvelteMap<number, ClothingProduct> = $state(
    new SvelteMap<number, ClothingProduct>()
  );
  bag: SvelteMap<string, ItemDetails> = $state(new SvelteMap<string, ItemDetails>);
  location: Country = $state({ country: "United States", code: "US" });
  checkoutState: 'static' | 'generating' = $state('static');

  constructor() {
    this.sortDropdownState = new SortDropdown();
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('Shop was already initialized!');
      return;
    }
    const response = await fetch(`/api/product/?productId=all`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const result = await response.json();
    this.addProducts(result.data);
    this.initialized = true;
  }

  addProducts(products: ClothingProduct[]) {
    products.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  addProduct(product: ClothingProduct) {
    if (!this.products.has(product.id)) {
      this.products.set(product.id, product);
    }
  }

  getProduct(id: number): ClothingProduct | undefined {
    return this.products.get(id);
  }

  getAllProducts(): ClothingProduct[] {
    return Array.from(this.products.values());
  }

  addToBag(product: ClothingProduct, sizeInfo: SizeInfo) {
    const itemId: ItemId = { productId: product.id, uuid: v4() }
    const itemDetails: ItemDetails = { ...product, ...sizeInfo };

    this.bag.set(createBagKey(itemId), itemDetails);
  }

  removeFromBag(itemKey: string) {
    this.bag.delete(itemKey);
  }

  async checkoutBag(bag: Bag) {
    this.checkoutState = 'generating';
    const bagArray: ItemDetails[] = Array.from(bag.values());
    const response = await fetch('/api/shop/createCheckoutSession', {
      method: 'POST',
      body: JSON.stringify({
        bag: bagArray,
        location: this.location
      })
    });

    this.checkoutState = 'static';
    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { url } = await response.json();

    // Redirect to Stripe Checkout
    window.location.href = url;
  };
}

const SHOP_CTX = 'SHOP_CTX';

export function setShopState(): Shop {
  const shopState: Shop = new Shop();
  setContext(SHOP_CTX, shopState);
  return shopState;
}

export function getShopState(): Shop {
  const shopState: Shop = getContext(SHOP_CTX);
  return shopState;
}
