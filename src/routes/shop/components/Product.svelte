<script lang="ts">
  import { goto } from '$app/navigation';
  import Image from '$lib/components/imageboard/post/Image.svelte';
  import type { ClothingProduct } from '$lib/types/shop/product/product';
  import type { Snippet } from 'svelte';

  interface ProductProps {
    product?: ClothingProduct;
    expanded?: boolean;
  }

  interface BodyProps {
    content: string;
  }

  let { product, expanded = false }: ProductProps = $props();

  function formatDate(date: Date | string): string {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toISOString().replace('T', ' ').slice(0, 19);
  }
</script>

{#snippet header()}
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
      No.{product.id}
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
    <div class="text-sm break-all whitespace-pre-line overflow-hidden hyphens-auto">
      {data.content}
    </div>
  </div>
{/snippet}

{#snippet content(data: ProductProps | null, index: number)}
  <div class="flex flex-col">
    <div class="inline-block align-bottom">
      {@render header()}
    </div>
    <div class="flex flex-col gap-2 md:flex-row">
      {#if data}
        {#if data.product}
          {#if index !== 4}
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
              {:else if index === 4}
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
      <button class="my-2">[add to bag]</button>
    {:else}
      <button class="my-2">[view details]</button>
    {/if}
    <div class="border border-black dark:border-white my-1 p-2 max-w-fit">
      {@render content({ product }, 4)}
    </div>
  </div>
</div>
