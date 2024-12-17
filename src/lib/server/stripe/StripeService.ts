import type { ShippingZone } from "$lib/shared/shop/shippingUtils";
import type { Size } from "$lib/types/shop/product/clothing";
import type { OrderItem } from "@prisma/client";
import { CheckoutSession } from "./shipping/checkout/CheckoutSession";
import { SPrice } from "./shipping/checkout/SPrice";
import { SProduct } from "./shipping/checkout/SProduct";

const BASE_URL = {
  dev: 'http://localhost:5173',
  prod: 'https://hardanimeshirts.com'
};

const getUrls = (isDev: boolean) => ({
  success: `${isDev ? BASE_URL.dev : BASE_URL.prod}/shop/success`,
  cancel: `${isDev ? BASE_URL.dev : BASE_URL.prod}/shop/cancel`
});

export class StripeService {
  private static instance: StripeService;
  private readonly urls: ReturnType<typeof getUrls>;

  constructor() {
    // Check if we're in development environment
    const isDev = false;
    this.urls = getUrls(isDev);
  }

  public static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  async createCheckoutSession(products: {
    name: string,
    description: string
    image: string,
    productId: number,
    price: number,
    details: Size
  }[], orderItems: OrderItem[], orderId: string, shippingZone: ShippingZone) {
    const items: SPrice[] = this.parseProducts(products, orderItems);
    const session = new CheckoutSession(
      this.urls.success,
      this.urls.cancel,
      items,
      orderId,
      shippingZone
    );
    return await session.create();
  }

  parseProducts(products: {
    name: string,
    description: string
    image: string,
    productId: number,
    price: number,
    details: Size
  }[], orderItems: OrderItem[]): SPrice[] {
    return products.map((product, index) => {
      const sProduct = new SProduct(
        product.name,
        product.description,
        product.productId,
        orderItems[index].id,
        product.image
      );
      return new SPrice(product.price * 100, sProduct);
    });
  }
}
