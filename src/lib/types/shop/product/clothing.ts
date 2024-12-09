export type Measurement = {
  value: number;
  unit: 'in' | 'cm';
};

export type Category = 'shirt' | 'pants' | 'outerwear';

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL';

export type ShirtMeasurements = {
  chest: Measurement;
  waist: Measurement;
  shoulders: Measurement;
  sleeves: Measurement;
  neck: Measurement;
  length: Measurement;
}

export type PantsMeasurements = {
  waist: Measurement;
  hips: Measurement;
  inseam: Measurement;
  length: Measurement;
};

export type OuterwearMeasurements = {
  chest: Measurement;
  waist: Measurement;
  shoulders: Measurement;
  sleeves: Measurement;
  neck: Measurement;
  length: Measurement;
}
