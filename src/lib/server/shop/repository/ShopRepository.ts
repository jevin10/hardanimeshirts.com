import prisma from "$lib/prisma";
import { uploadProductImage } from "$lib/server/s3/upload";
import type { ClothingProduct } from "$lib/types/shop/product/product";
import type { CreateClothingDataPayload, CreateClothingProductPayload } from "$lib/types/shop/product/schemas";
import type { ClothingData, Product as DBProduct, Prisma, ProductDomain } from "@prisma/client";

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

  async createClothingProduct(params: CreateClothingProductPayload): Promise<ClothingProduct> {
    const result = await prisma.$transaction(async (tx) => {
      // predict the id for the next product to be uploaded
      const id: number = await tx.product.count() + 1;
      // upload the images to s3 bucket & get urls
      const images: string[] = await this.uploadProductImages(id, params.images)
      // create product in database
      const product = await tx.product.create({
        data: {
          domain: 1,
          name: params.name,
          price: params.price,
          details: params.details,
          images,
          categories: [params.category],
          available: true
        }
      });
      // create clothing data
      const clothingData: ClothingData = await this.createClothingData({
        id: product.id,
        sizeData: params.ClothingData.sizeData,
        quantity: params.ClothingData.quantity
      }, tx);

      return {
        ...product,
        ProductDomain: {
          id: product.domain,
          name: 'clothing'
        },
        ClothingData: clothingData
      }
    });

    return {
      ...result,
      ProductDomain: {
        ...result.ProductDomain,
        id: result.ProductDomain.id!
      },
      ClothingData: result.ClothingData
    }
  }

  // takes an array of 3 buffers
  // order: front, back, detail
  // uploads the images to the s3 bucket returns result as urls
  private async uploadProductImages(id: number, images: Buffer[]): Promise<string[]> {
    if (images.length !== 3) {
      throw new Error('Amount of images incorrect!');
    }

    const front: string = await uploadProductImage(id, 'front', images[0]);
    const back: string = await uploadProductImage(id, 'back', images[1]);
    const detail: string = await uploadProductImage(id, 'detail', images[2]);

    return [front, back, detail];
  }


  private async createClothingData(params: ClothingData, tx: Prisma.TransactionClient): Promise<ClothingData> {
    if (!params.sizeData) {
      throw new Error('sizeData is missing!');
    }
    return await tx.clothingData.create({
      data: {
        id: params.id,
        quantity: params.quantity,
        sizeData: params.sizeData
      }
    });
  }
}
