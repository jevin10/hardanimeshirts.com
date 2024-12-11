export type Measurements = Record<string, string>;

export type Category = 'shirt' | 'pants' | 'outerwear';

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL';

export type SizeInfo = {
  size: Size;
  measurements: Measurements;
}
