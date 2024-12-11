import type { CreateClothingDataPayload, CreateClothingProductPayload } from "$lib/types/shop/product/schemas";
import type { ClothingData } from "@prisma/client";
import { ShopRepository } from "../../repository/ShopRepository";
import type { ClothingProduct } from "$lib/types/shop/product/product";

export class ProductService {
  private static instance: ProductService;
  private shopRepository: ShopRepository;

  constructor() {
    this.shopRepository = ShopRepository.getInstance();
  }

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  async createClothingProduct(params: CreateClothingProductPayload): Promise<ClothingProduct> {

  }
}
