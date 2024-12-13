import type { ClothingProduct } from "$lib/types/shop/product/product";
import type { CreateClothingProductPayload } from "$lib/types/shop/product/schemas";
import { ShopRepository } from "./repository/ShopRepository";
import { CheckoutService } from "./services/checkout/CheckoutService";
import { ProductService } from "./services/product/ProductService";

export class ShopService {
  private static instance: ShopService;
  private shopRepository: ShopRepository;
  private productService: ProductService;
  private checkoutService: CheckoutService;

  private constructor() {
    this.shopRepository = ShopRepository.getInstance();
    this.productService = ProductService.getInstance();
    this.checkoutService = CheckoutService.getInstance();
  }

  public static getInstance(): ShopService {
    if (!ShopService.instance) {
      ShopService.instance = new ShopService();
    }
    return ShopService.instance;
  }

  getCheckoutService(): CheckoutService {
    return this.checkoutService;
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
