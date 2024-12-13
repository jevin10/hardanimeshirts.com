import type { SProduct, SProductOutput } from "./SProduct";

export interface SPriceOutput {
  currency: string;
  unit_amount: number;
  product_data: SProductOutput;
}

export class SPrice {
  currency: string = 'usd';
  unitAmount: number;
  product: SProduct;

  constructor(
    unitAmount: number,
    product: SProduct
  ) {
    this.unitAmount = unitAmount;
    this.product = product;
  }

  create(): SPriceOutput {
    return {
      currency: this.currency,
      unit_amount: this.unitAmount,
      product_data: this.product.create()
    };
  };
}
