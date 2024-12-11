import { ShopService } from "$lib/server/shop/ShopService";
import type { ClothingProduct } from "$lib/types/shop/product/product";
import type { LayoutServerLoad } from "../$types";

const shopService: ShopService = ShopService.getInstance();

export const load: LayoutServerLoad = async () => {
  let products: ClothingProduct[] = [];

  try {
    products = await shopService.getClothingProducts();
  } catch (err) {
    console.error('Error fetching products:', err);
  }

  return {
    products
  }
}
