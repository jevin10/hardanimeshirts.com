import { ShopRepository } from "../../repository/ShopRepository";

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

  async createClothingProduct() {

  }

  private async createClothingProductData() {

  }
}
