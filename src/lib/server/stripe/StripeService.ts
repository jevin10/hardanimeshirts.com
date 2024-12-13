import type { ShippingZone } from "$lib/shared/shop/shippingUtils";
import { CheckoutSession } from "./shipping/checkout/CheckoutSession";
import type { SPrice } from "./shipping/checkout/SPrice";
import { stripe } from "./stripe";

const DEV_URL = {
  success: 'localhost:5173/shop/success',
  cancel: 'localhost:5173/shop/cancel'
}

export class StripeService {
  private static instance: StripeService;

  constructor() { }

  public static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  // NOTE: Change this to the actual url in production
  async createCheckoutSession(items: SPrice[], orderId: string, shippingZone: ShippingZone) {
    const session = new CheckoutSession(DEV_URL.success, DEV_URL.cancel, items, orderId, shippingZone);

    return await session.create();
  }
}
