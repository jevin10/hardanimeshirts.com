import type { Product } from "./product";

export type Measurement = {
  value: number;
  unit: 'in' | 'cm';
};

export type Size = 'xs' | 's' | 'm' | 'l' | 'xl';

export type Category = 'shirt' | 'pants';

export type BaseClothing = Product & {
  category: Category;
  size: Size;
  measurements: Record<string, Measurement>;
};

export type Shirt = BaseClothing & {
  measurements: {
    chest: Measurement;
    waist: Measurement;
    shoulders: Measurement;
    sleeves: Measurement;
    neck: Measurement;
    length: Measurement;
  }
}

export type Pants = BaseClothing & {
  measurements: {
    waist: Measurement;
    hips: Measurement;
    inseam: Measurement;
    length: Measurement;
  }
};
