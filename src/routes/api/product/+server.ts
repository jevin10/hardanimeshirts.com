import { requireUser } from "$lib/server/auth";
import { ShopService } from "$lib/server/shop/ShopService";
import { createClothingProductSchema, type CreateClothingProductPayload } from "$lib/types/shop/product/schemas";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { ZodError } from "zod";

const shopService: ShopService = ShopService.getInstance();

export const POST: RequestHandler = async ({ request, locals }) => {
  // Auth checks
  if (!locals.user || locals.user.username !== '1owroller') {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const formData = await request.formData();

    // Validate files first
    const files = ['front', 'back', 'detail'].map(key => {
      const file = formData.get(key);
      if (!file || !(file instanceof Blob)) {
        throw error(400, { message: `Missing ${key} file` });
      }
      if (file.type !== 'image/webp') {
        throw error(400, { message: `${key} file must be WebP` });
      }
      return file;
    });

    // Convert files to buffers
    const images = await Promise.all(
      files.map(file => file.arrayBuffer())
    ).then(buffers => buffers.map(buf => Buffer.from(buf)));

    // Parse and validate non-file data
    const details = formData.get('details');
    const sizeData = formData.get('sizeData');

    const productData: CreateClothingProductPayload = {
      name: formData.get('name')?.toString() ?? '',
      description: formData.get('description')?.toString() ?? '',
      details: details ? JSON.parse(details.toString()) : [],
      category: formData.get('category')?.toString() ?? '',
      price: Number(formData.get('price')) || 0,
      images,
      ClothingData: {
        quantity: Number(formData.get('quantity')) || 0,
        sizeData: sizeData ? JSON.parse(sizeData.toString()) : []
      }
    };

    // Validate entire payload
    const validatedData = createClothingProductSchema.parse(productData);

    // Create product
    const result = await shopService.createClothingProduct(validatedData);

    return json({ status: 201, data: result });

  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.errors.map(e => e.message).join(', ');
      throw error(400, { message: errors });
    }
    if (err instanceof Error) {
      throw error(500, { message: err.message });
    }
    throw error(500, { message: 'Unknown error occurred' });
  }
};

export const GET: RequestHandler = async ({ url }) => {
  try {
    const productId = url.searchParams.get('productId');
    if (!productId) {
      return new Response('Must provide productId', { status: 400 });
    }

    const result = await shopService.getClothingProduct(Number(productId));

    return json({ status: 201, data: result });
  } catch (err) {
    if (err instanceof Error) {
      throw error(500, { message: err.message });
    }
    throw error(500, { message: 'Unknown error occurred' });
  }
}
