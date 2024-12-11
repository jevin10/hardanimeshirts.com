import type { ClothingProduct } from "$lib/types/shop/product/product";
import { ShopRepository } from "./repository/ShopRepository";

export class ShopService {
  private static instance: ShopService;
  private shopRepository: ShopRepository;

  private constructor() {
    this.shopRepository = ShopRepository.getInstance();
  }

  public static getInstance(): ShopService {
    if (!ShopService.instance) {
      ShopService.instance = new ShopService();
    }
    return ShopService.instance;
  }

  async getClothingProducts(): Promise<ClothingProduct[]> {
    return await this.shopRepository.getClothingProducts();
  }

  async getClothingProduct(id: number): Promise<ClothingProduct> {
    return await this.getClothingProduct(id);
  }
}
