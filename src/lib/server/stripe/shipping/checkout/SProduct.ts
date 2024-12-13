export interface SProductOutput {
  name: string;
  description: string;
  metadata: {
    productId: number;
    orderItemId: string;
  };
  tax_code: string;
  images: string[];
}

export class SProduct {
  name: string;
  description: string;
  metadata: {
    productId: number;
    orderItemId: string;
  };
  taxCode: string;
  images: string[];

  constructor(
    name: string,
    description: string,
    productId: number,
    orderItemId: string,
    image: string,
  ) {
    this.name = name;
    this.description = description;
    this.metadata = { productId, orderItemId };
    // tax code for tangible goods
    this.taxCode = 'txcd_99999999';
    this.images = [image];
  }

  create(): SProductOutput {
    return {
      name: this.name,
      description: this.description,
      metadata: this.metadata,
      tax_code: this.taxCode,
      images: this.images,
    };
  };
}
