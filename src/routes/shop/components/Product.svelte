<script lang="ts">
  import { goto } from '$app/navigation';
  import Image from '$lib/components/imageboard/post/Image.svelte';
  import type { Size } from '$lib/types/shop/product/clothing';
  import type { ClothingProduct } from '$lib/types/shop/product/product';
  import type { CreateClothingDataPayload } from '$lib/types/shop/product/schemas';
  import type { Snippet } from 'svelte';

  type Measurements = Record<string, string>;

  interface ProductProps {
    product?: ClothingProduct;
    expanded?: boolean;
  }

  interface BodyProps {
    content: string;
  }

  let { product, expanded = false }: ProductProps = $props();

  let size: Size = $state('XS');
  const sizes: Size[] = ['XS', 'S', 'M', 'L', 'XL'];
  let sizeData: CreateClothingDataPayload['sizeData'] = $state(
    (product?.ClothingData?.sizeData as CreateClothingDataPayload['sizeData']) ?? []
  );

  let measurements: string = $derived.by(() => {
    const sizeInfo = sizeData.find((data) => data.size === size);
    return sizeInfo ? formatMeasurements(sizeInfo.measurements) : 'No measurements available';
  });

  function handleChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    size = target.value as Size;
  }

  function formatMeasurements(measurements: Record<string, string>): string {
    return Object.entries(measurements)
      .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
      .join('\n');
  }

  function formatDate(date: Date | string): string {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toISOString().replace('T', ' ').slice(0, 19);
  }

  function formatDetails(details: string[]): string {
    return details.map((detail) => `>${detail}`).join('\n');
  }
</script>

{#snippet header(index: number)}
  {#if product}
    <span class="text-base">
      <button
        onclick={() => {
          goto(`/shop/${product.ProductDomain.name}/${product.id}`);
        }}
      >
        Anonymous
      </button>
    </span>
    <span class="text-sm text-gray-600 dark:text-gray-300">
      {formatDate(product.createdAt)}
      No.{index + 1}
    </span>
  {:else}
    <span class="text-base">
      <button>XXXXXX</button>
    </span>
    <span class="text-sm text-gray-600 dark:text-gray-300">
      {formatDate(new Date())}
      No.XXX
    </span>
  {/if}
{/snippet}

{#snippet body(data: BodyProps)}
  <div class="min-w-0 flex-1">
    <div class="text-sm break-all whitespace-pre-line overflow-hidden hyphens-auto leading-tight">
      {data.content}
    </div>
  </div>
{/snippet}

{#snippet content(data: ProductProps | null, index: number)}
  <div class="flex flex-col">
    <div class="inline-block align-bottom">
      {@render header(index)}
    </div>
    <div class="flex flex-col gap-2 md:flex-row">
      {#if data}
        {#if data.product}
          {#if index !== 3}
            <div class="flex-shrink-0">
              <Image url={data.product.images[index]} />
            </div>
          {/if}

          {#if data.product.description}
            <div class="flex flex-col items-start">
              {#if index === 0}
                <div class="text-2xl md:text-3xl">
                  {data.product.name}
                </div>
                <div class="text-sm my-1 font-sans">
                  {data.product.price} USD
                </div>
                <div class="border border-black dark:border-white my-1 p-2 max-w-fit">
                  {@render content({ product }, 3)}
                </div>
                {#if expanded}
                  <div class="my-1 flex flex-row items-center gap-2">
                    <div class="flex flex-row gap-1 mt-2">
                      Size
                      <select
                        value={size}
                        onchange={handleChange}
                        class="border shadow-sm bg-white"
                      >
                        {#each sizes as sizeOption}
                          <option value={sizeOption}>{sizeOption}</option>
                        {/each}
                      </select>
                    </div>
                    <button class="my-0 text-xl font-bold">[sold out]</button>
                  </div>
                {:else if product}
                  <button class="my-1" onclick={() => goto(`/shop/clothing/${product.id}`)}
                    >[expand info]</button
                  >
                {/if}
              {:else if index === 1}
                {@render body({ content: formatDetails(data.product.details) })}
              {:else if index === 2}
                {@render body({ content: measurements })}
              {:else if index === 3}
                {@render body({ content: data.product.description })}
              {/if}
            </div>
          {/if}
        {:else}
          {@render body({ content: 'XXXX XXXXXXXX XXXX XXXX' })}
        {/if}
      {/if}
    </div>
  </div>
{/snippet}

<div class="border-black dark:border-white border-l-2 px-3">
  <div class="mb-2">
    {@render content({ product }, 0)}
    {#if expanded}
      <div class="border border-black dark:border-white my-1 p-2 max-w-fit">
        {@render content({ product }, 1)}
      </div>
      <div class="border border-black dark:border-white my-1 p-2 max-w-fit">
        {@render content({ product }, 2)}
      </div>
    {/if}
  </div>
</div>
