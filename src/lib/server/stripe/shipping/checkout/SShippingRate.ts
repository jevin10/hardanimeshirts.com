import type { ShippingZone } from "$lib/shared/shop/shippingUtils";

export interface SShippingRateOutput {
  display_name: string;
  type: 'fixed_amount';
  fixed_amount: {
    amount: number;
    currency: 'usd';
  };
  tax_code: 'txcd_92010001';
  delivery_estimate: {
    maximum: 7;
    minimum: 5;
  }
}

export class SShippingRate {
  shippingZone: ShippingZone;

  constructor(shippingZone: ShippingZone) {
    this.shippingZone = shippingZone;
  }

  create(): SShippingRateOutput {
    return {
      display_name: this.shippingZone.shippingGroup + ': Express',
      type: 'fixed_amount',
      fixed_amount: {
        amount: this.shippingZone.price,
        currency: 'usd',
      },
      tax_code: 'txcd_92010001',
      delivery_estimate: {
        maximum: 7,
        minimum: 5
      }
    };
  };
}
