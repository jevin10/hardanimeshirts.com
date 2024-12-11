import prisma from "$lib/prisma";
import type { ClothingProduct } from "$lib/types/shop/product/product";
import type { ClothingData, Product as DBProduct, ProductDomain } from "@prisma/client";

// NOTE: Right now, getting products only accounts for ClothingData types. If there are any other types in the future, you need to account for them.

export class ShopRepository {
  private static instance: ShopRepository;

  private constructor() { }

  public static getInstance(): ShopRepository {
    if (!ShopRepository.instance) {
      ShopRepository.instance = new ShopRepository();
    }
    return ShopRepository.instance;
  }

  async getClothingProducts(): Promise<ClothingProduct[]> {
    const products = await prisma.product.findMany({
      where: {
        available: true,
      },
      include: {
        ProductDomain: true,
        ClothingData: true
      }
    });

    const filteredProducts: ClothingProduct[] = products.filter((product): product is (typeof product & {
      ProductDomain: NonNullable<typeof product.ProductDomain>,
      ClothingData: NonNullable<typeof product.ClothingData>
    }) => {
      return product.ProductDomain !== null && product.ClothingData !== null;
    });

    return filteredProducts;
  }

  async getClothingProduct(id: number): Promise<ClothingProduct> {
    const dbProduct = await prisma.product.findUniqueOrThrow({
      where: { id },
      include: {
        ProductDomain: true,
        ClothingData: true
      }
    });

    if (!dbProduct.ProductDomain || !dbProduct.ClothingData) {
      throw new Error('Product missing required domain or clothing data');
    }

    return {
      ...dbProduct,
      ProductDomain: dbProduct.ProductDomain,
      ClothingData: dbProduct.ClothingData
    };
  }
}
