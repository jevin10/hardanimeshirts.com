export interface SProductOutput {
  name: string;
  description: string;
  metadata: {
    productId: number;
    orderItemId: string;
  };
  tax_code: string;
  images: string[];
  shippable: true;
  url: string;
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
  url: string;

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
    // url for clothing
    this.url = `https://hardanimeshirts.com/clothing/${productId}`;
  }

  create(): SProductOutput {
    return {
      name: this.name,
      description: this.description,
      metadata: this.metadata,
      tax_code: this.taxCode,
      images: this.images,
      shippable: true,
      url: this.url
    };
  };
}
