import type { SortCategory, SortProduct } from "$lib/types/shop/product/sort";

export class SortDropdown {
  category: SortCategory = $state('all');
  sort: SortProduct = $state('newest');
  categoryOpen = $state(false);
  sortOpen = $state(false);

  constructor() { }

  handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.categoryOpen = false;
      this.sortOpen = false;
    }
  }

  toggleCategory = () => {
    this.categoryOpen = !this.categoryOpen;
    this.sortOpen = false; // Close other dropdown
  }

  toggleSort = () => {
    this.sortOpen = !this.sortOpen;
    this.categoryOpen = false; // Close other dropdown
  }

  handleCategoryKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      this.toggleCategory();
    }
  }

  handleSortKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      this.toggleSort();
    }
  }

  setCategory = (newCategory: SortCategory) => {
    this.category = newCategory;
  }

  setSort = (newSort: SortProduct) => {
    this.sort = newSort;
  }

  handleCategoryOptionKeydown = (event: KeyboardEvent, type: SortCategory) => {
    if (event.key === 'Enter') {
      this.setCategory(type);
    }
  }

  handleSortOptionKeydown = (event: KeyboardEvent, type: SortProduct) => {
    if (event.key === 'Enter') {
      this.setSort(type);
    }
  }
}
