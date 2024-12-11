import type { SvelteMap } from "svelte/reactivity";
import type { ClothingProduct } from "../product/product";

export type ItemId = {
  productId: number;
  uuid: string;
}

export type Bag = SvelteMap<string, ClothingProduct>;

// helper for converting ItemId into string
export function createBagKey(itemId: ItemId): string {
  return `${itemId.productId}-${itemId.uuid}`;
}

// helper for converting string into ItemId
export function parseBagKey(bagKey: string): ItemId {
  const [productId, uuid] = bagKey.split('-');
  return {
    productId: parseInt(productId),
    uuid: uuid
  };
}

