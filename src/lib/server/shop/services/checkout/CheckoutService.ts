import type { Bag } from "$lib/types/shop/state/bag";

export class CheckoutService {
  private static instance: CheckoutService

  constructor() { }

  public static getInstance(): CheckoutService {
    if (!CheckoutService.instance) {
      CheckoutService.instance = new CheckoutService();
    }
    return CheckoutService.instance;
  }

  async checkout(bag: Bag, userId: string)

}
