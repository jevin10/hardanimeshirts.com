<script lang="ts">
  import { getShopState, Shop } from '../state/Shop.svelte';
  import { countries } from '$lib/shared/locations/countries';

  let isVisible = $state(false);
  let searchValue = $state('');
  let filteredCountries = $state<typeof countries>([]);
  let selectedCountry = $state<(typeof countries)[0] | null>(null);

  const shopState: Shop = getShopState();

  function filterCountries(value: string) {
    if (!value.trim()) {
      filteredCountries = countries;
      return;
    }

    const searchTerm = value.toLowerCase();
    filteredCountries = countries.filter(
      (country) =>
        country.country.toLowerCase().includes(searchTerm) ||
        country.code.toLowerCase().includes(searchTerm)
    );
  }

  function handleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    searchValue = value;
    filterCountries(value);
  }

  function selectCountry(country: (typeof countries)[0]) {
    selectedCountry = country;
    searchValue = country.country;
    filteredCountries = [];
  }

  function handleChange() {
    if (selectedCountry) {
      shopState.location = selectedCountry;
      isVisible = false;
      searchValue = '';
      selectedCountry = null;
    }
  }

  function handleFocus() {
    if (!searchValue) {
      filteredCountries = countries;
    }
  }
</script>

<div class="text-sm mt-2 flex justify-center gap-1">
  Your Location: {shopState.location.code}
  <button
    onclick={() => {
      isVisible = true;
    }}>[change]</button
  >
</div>

{#if isVisible}
  <div class="overlay">
    <div class="min-h-[60vh] md:h-[30rem] w-[30rem] m-5 modal flex flex-col">
      <div class="w-full border-b border-black dark:border-white flex flex-row justify-between p-1">
        <div class="text-m">Choose Country</div>
        <button
          type="button"
          onclick={() => {
            isVisible = false;
            searchValue = '';
            filteredCountries = [];
          }}
        >
          [x]
        </button>
      </div>

      <div class="flex-1 flex flex-col items-center justify-center gap-2">
        <div class="text-3xl">Select a country</div>
        <div class="relative w-64">
          <input
            value={searchValue}
            oninput={handleInput}
            onfocus={handleFocus}
            placeholder={shopState.location.country}
            class="px-1 w-full"
          />
          {#if filteredCountries.length > 0}
            <div
              class="absolute w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mt-1 rounded-md shadow-lg"
            >
              {#each filteredCountries as country}
                <button
                  class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onclick={() => selectCountry(country)}
                >
                  {country.country} ({country.code})
                </button>
              {/each}
            </div>
          {/if}
        </div>
        <button class="mt-1" onclick={handleChange} disabled={!selectedCountry}> [change] </button>
      </div>
    </div>
  </div>
{/if}
