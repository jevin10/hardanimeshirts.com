import type { SortCategory, SortProduct } from "$lib/types/shop/product/sort";
import { getContext, setContext } from "svelte";
import { SortDropdown } from "./SortDropdown.svelte";

export class Shop {
  sortDropdownState: SortDropdown;

  constructor() {
    this.sortDropdownState = new SortDropdown();
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
