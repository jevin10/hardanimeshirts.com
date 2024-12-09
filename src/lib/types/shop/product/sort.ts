import type { Category } from "./clothing";

export type SortCategory = Category | 'all';
export const sortCategoryTypes: Record<SortCategory, SortCategory> = {
  all: 'all',
  shirt: 'shirt',
  pants: 'pants',
  outerwear: 'outerwear'
}

export type SortProduct = 'price ascending'
  | 'price descending'
  | 'newest'
  | 'oldest'
export const sortProductTypes: Record<SortProduct, SortProduct> = {
  'price ascending': 'price ascending',
  'price descending': 'price descending',
  'newest': 'newest',
  'oldest': 'oldest'
}
