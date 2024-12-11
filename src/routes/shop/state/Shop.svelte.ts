import { SvelteMap } from 'svelte/reactivity';
import type { SortCategory, SortProduct } from "$lib/types/shop/product/sort";
import { getContext, setContext } from "svelte";
import { SortDropdown } from "./SortDropdown.svelte";
import type { ClothingProduct } from "$lib/types/shop/product/product";

export class Shop {
  sortDropdownState: SortDropdown;
  products = $state(new SvelteMap<number, ClothingProduct>());

  constructor() {
    this.sortDropdownState = new SortDropdown();
  }

  addProducts(products: ClothingProduct[]) {
    products.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  getProduct(id: number): ClothingProduct | undefined {
    return this.products.get(id);
  }

  getAllProducts(): ClothingProduct[] {
    return Array.from(this.products.values());
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
