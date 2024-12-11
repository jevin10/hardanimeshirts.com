import type { Product as DBProduct, ClothingData, ProductDomain } from "@prisma/client"

export type ClothingProduct = DBProduct & {
  ProductDomain: ProductDomain,
  ClothingData: ClothingData
}
