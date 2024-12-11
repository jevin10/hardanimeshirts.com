<script lang="ts">
  let showVariantForm = $state(false);
  let variants = $state<string[]>([]);

  function addVariant(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const size = form.size.value;
    const measurements = form.measurements.value;
    variants = [...variants, `${size}: ${measurements}`];
  }
</script>

<div class="max-w-2xl mx-auto p-6">
  <!-- Main Product Form -->
  <form class="space-y-3">
    <div>
      <label>Name</label>
      <input type="text" class="w-full border p-2" />
    </div>

    <div>
      <label>Description</label>
      <textarea class="w-full border p-2" rows="3"></textarea>
    </div>

    <div>
      <label>Details</label>
      <textarea class="w-full border p-2" rows="3"></textarea>
    </div>

    <div>
      <label>Images</label>
      <div class="space-y-2">
        <input type="file" accept="image/*" class="w-full border-none" />
        <input type="file" accept="image/*" class="w-full border-none" />
        <input type="file" accept="image/*" class="w-full border-none" />
      </div>
    </div>

    <div>
      <label>Category</label>
      <select class="w-full border p-2">
        <option value="shirt">Shirt</option>
        <option value="outerwear">Outerwear</option>
        <option value="bottoms">Bottoms</option>
      </select>
    </div>

    <div>
      <label>Price</label>
      <input type="number" class="w-full border p-2" />
    </div>

    <div>
      <label>Quantity</label>
      <input type="number" class="w-full border p-2" />
    </div>

    <button type="submit" class="text-xl">[submit]</button>
  </form>

  <div class="my-4">
    <h3 class="text-xl mb-2">Added Variants:</h3>
    {#if variants.length > 0}
      {#each variants as variant}
        <div class="text-sm">{variant}</div>
      {/each}
    {/if}
  </div>

  <button class="text-xl" onclick={() => (showVariantForm = !showVariantForm)}>
    {#if !showVariantForm}
      [+] add variant
    {:else}
      [-] add variant
    {/if}
  </button>

  {#if showVariantForm}
    <form class="space-y-3 mt-4" onsubmit={addVariant}>
      <div>
        <label>Size</label>
        <select name="size" class="w-full border p-2">
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
      </div>

      <div>
        <label>Measurements (JSON)</label>
        <textarea name="measurements" class="w-full border p-2" rows="3"></textarea>
      </div>

      <button type="submit" class="text-xl"> [add] </button>
    </form>
  {/if}
</div>
