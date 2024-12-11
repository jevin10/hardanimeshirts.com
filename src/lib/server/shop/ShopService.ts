import type { ClothingProduct } from "$lib/types/shop/product/product";
import type { CreateClothingProductPayload } from "$lib/types/shop/product/schemas";
import { ShopRepository } from "./repository/ShopRepository";
import { ProductService } from "./services/product/ProductService";

export class ShopService {
  private static instance: ShopService;
  private shopRepository: ShopRepository;
  private productService: ProductService;

  private constructor() {
    this.shopRepository = ShopRepository.getInstance();
    this.productService = ProductService.getInstance();
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
    return await this.shopRepository.getClothingProduct(id);
  }

  async createClothingProduct(params: CreateClothingProductPayload): Promise<ClothingProduct> {
    return await this.productService.createClothingProduct(params);
  }

}
