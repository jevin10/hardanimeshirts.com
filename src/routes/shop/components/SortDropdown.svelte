<script lang="ts">
  import { sortCategoryTypes, sortProductTypes } from '$lib/types/shop/product/sort';
  import { getShopState, Shop } from '../state/Shop.svelte';
  import type { SortDropdown } from '../state/SortDropdown.svelte';

  const shopState: Shop = getShopState();
  const sortDropdownState: SortDropdown = shopState.sortDropdownState;
</script>

<svelte:window onclick={sortDropdownState.handleClick} />

<div class="flex flex-row gap-2 text-base relative">
  <div class="dropdown">
    <span>category:</span>
    <div
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={sortDropdownState.categoryOpen}
      aria-controls="category-listbox"
      tabindex="0"
      class="link relative inline-block hover:cursor-pointer"
      onclick={sortDropdownState.toggleCategory}
      onkeydown={sortDropdownState.handleCategoryKeydown}
    >
      {sortDropdownState.category}
      {#if sortDropdownState.categoryOpen}
        <div
          id="category-listbox"
          class="absolute top-full left-0 border rounded shadow-lg z-10"
          role="listbox"
        >
          {#each Object.values(sortCategoryTypes).filter((type) => type !== sortDropdownState.category) as type}
            <div
              role="option"
              aria-selected={sortDropdownState.category === type}
              tabindex="0"
              class="block w-[3rem] text-left cursor-pointer link"
              onclick={() => sortDropdownState.setCategory(type)}
              onkeydown={(e) => sortDropdownState.handleCategoryOptionKeydown(e, type)}
            >
              {type}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
  |
  <div class="dropdown">
    <span>sort:</span>
    <div
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={sortDropdownState.sortOpen}
      aria-controls="sort-listbox"
      tabindex="0"
      class="link relative inline-block hover:cursor-pointer"
      onclick={sortDropdownState.toggleSort}
      onkeydown={sortDropdownState.handleSortKeydown}
    >
      {sortDropdownState.sort}
      {#if sortDropdownState.sortOpen}
        <div
          id="sort-listbox"
          class="absolute top-full left-0 border rounded shadow-lg z-10"
          role="listbox"
        >
          {#each Object.values(sortProductTypes).filter((type) => type !== sortDropdownState.sort) as type}
            <div
              role="option"
              aria-selected={sortDropdownState.sort === type}
              tabindex="0"
              class="block w-[8rem] text-left cursor-pointer link"
              onclick={() => sortDropdownState.setSort(type)}
              onkeydown={(e) => sortDropdownState.handleSortOptionKeydown(e, type)}
            >
              {type}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
