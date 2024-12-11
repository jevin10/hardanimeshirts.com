import { SvelteMap } from 'svelte/reactivity';
import type { SortCategory, SortProduct } from "$lib/types/shop/product/sort";
import { v4 } from 'uuid';
import { getContext, setContext } from "svelte";
import { SortDropdown } from "./SortDropdown.svelte";
import type { ClothingProduct } from "$lib/types/shop/product/product";
import { createBagKey, type Bag, type ItemDetails, type ItemId } from '$lib/types/shop/state/bag';
import type { SizeInfo } from '$lib/types/shop/product/clothing';

export class Shop {
  initialized: boolean = $state(false);
  sortDropdownState: SortDropdown;
  products: SvelteMap<number, ClothingProduct> = $state(
    new SvelteMap<number, ClothingProduct>()
  );
  bag: Bag = $state(new SvelteMap<string, ItemDetails>);

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
