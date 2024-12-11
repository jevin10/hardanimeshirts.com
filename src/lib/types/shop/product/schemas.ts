import { z } from "zod";

export const createClothingDataSchema = z.object({
  quantity: z.number(),
  sizeData: z.array(z.object({
    size: z.enum(['XS', 'S', 'M', 'L', 'XL']),
    measurements: z.record(z.string(), z.string())
  }))
})


export const createClothingProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  details: z.array(z.string()),
  images: z.array(z.instanceof(Buffer)),
  category: z.string(),
  price: z.number(),
  ClothingData: createClothingDataSchema
});

export type CreateClothingDataPayload = z.infer<typeof createClothingDataSchema>;
export type CreateClothingProductPayload = z.infer<typeof createClothingProductSchema>;
