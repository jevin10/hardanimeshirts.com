import { getCountryCodes } from "$lib/shared/locations/countries";
import { type ShippingZone } from "$lib/shared/shop/shippingUtils";
import type Stripe from "stripe";
import { stripe } from "../../stripe";
import type { SPrice, SPriceOutput } from "./SPrice";
import { SShippingRate, type SShippingRateOutput } from "./SShippingRate";

export interface LineItem {
  price_data: SPriceOutput,
  quantity: 1
}

export class CheckoutSession {
  private sshippingRate: SShippingRate;
  successUrl: string;
  cancelUrl: string;
  items: SPrice[];
  orderId: string;
  shippingZone: ShippingZone;

  constructor(successUrl: string, cancelUrl: string, items: SPrice[], orderId: string, shippingZone: ShippingZone) {
    this.successUrl = successUrl;
    this.cancelUrl = cancelUrl;
    this.items = items;
    this.orderId = orderId;
    this.shippingZone = shippingZone;
    this.sshippingRate = new SShippingRate(shippingZone);
  }

  private parseItems(items: SPrice[]): LineItem[] {
    return items.map(item => ({
      price_data: item.create(),
      quantity: 1
    }));
  }

  async create() {
    return await stripe.checkout.sessions.create({
      success_url: this.successUrl + `?orderId=` + this.orderId,
      cancel_url: this.cancelUrl,
      client_reference_id: this.orderId,
      line_items: this.parseItems(this.items),
      mode: 'payment',
      shipping_options: [{
        shipping_rate_data: this.sshippingRate.create()
      }],
      shipping_address_collection: {
        allowed_countries: this.shippingZone.countries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[]
      }
    });
  }
}

