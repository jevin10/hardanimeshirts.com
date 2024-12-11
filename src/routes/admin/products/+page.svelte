<script lang="ts">
  import type { CreateClothingProductPayload } from '$lib/types/shop/product/schemas';

  let showVariantForm = $state(false);
  let sizeData = $state<CreateClothingProductPayload['ClothingData']['sizeData']>([]);

  // Form data states
  let name = $state('');
  let description = $state('');
  let details = $state('');
  let category = $state('shirt');
  let price = $state(0);
  let quantity = $state(0);
  let frontImage = $state<File | null>(null);
  let backImage = $state<File | null>(null);
  let detailImage = $state<File | null>(null);

  function addVariant(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const size = form.size.value;
    const measurementsText = form.measurements.value.trim();

    try {
      // Remove any single quotes if present and ensure we have valid JSON
      const cleanedJson = measurementsText.replace(/'/g, '"');
      const measurements = JSON.parse(cleanedJson);
      sizeData = [...sizeData, { size, measurements }];
      form.reset();
    } catch (e) {
      alert('Invalid JSON format. Please ensure your measurements are in valid JSON format.');
    }
  }

  function handleFileChange(e: Event, setter: (file: File | null) => void) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0] ?? null;
    setter(file);
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();

    try {
      const detailsArray = details
        .split('\n')
        .map((d) => d.trim())
        .filter((d) => d.length > 0);

      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('details', JSON.stringify(detailsArray));
      formData.append('category', category);
      formData.append('price', price.toString());
      formData.append('quantity', quantity.toString());
      formData.append('sizeData', JSON.stringify(sizeData));

      // Validate and append images
      if (!frontImage || !backImage || !detailImage) {
        alert('All images are required');
        return;
      }

      formData.append('front', frontImage);
      formData.append('back', backImage);
      formData.append('detail', detailImage);

      const response = await fetch('/api/product', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      alert('Product created successfully!');
      // Reset form
      name = '';
      description = '';
      details = '';
      category = 'shirt';
      price = 0;
      quantity = 0;
      sizeData = [];
      frontImage = null;
      backImage = null;
      detailImage = null;
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create product');
    }
  }
</script>

<div class="max-w-2xl mx-auto p-6">
  <form class="space-y-3" onsubmit={handleSubmit}>
    <div>
      <label for="name">Name</label>
      <input id="name" type="text" class="w-full border p-2" bind:value={name} required />
    </div>
    <div>
      <label for="description">Description</label>
      <textarea
        id="description"
        class="w-full border p-2"
        rows="3"
        bind:value={description}
        required
      ></textarea>
    </div>
    <div>
      <label for="details">Details (one per line)</label>
      <textarea
        id="details"
        class="w-full border p-2"
        rows="3"
        bind:value={details}
        placeholder="Enter each detail on a new line:
Made from 100% cotton
Machine washable
Imported"
        required
      ></textarea>
    </div>
    <div>
      <span class="block mb-2">Images (WebP only)</span>
      <div class="space-y-2">
        <div>
          <label for="frontImage" class="text-sm text-gray-600">Front Image</label>
          <input
            id="frontImage"
            type="file"
            accept="image/webp"
            class="w-full border-none"
            onchange={(e) => handleFileChange(e, (file) => (frontImage = file))}
            required
          />
        </div>
        <div>
          <label for="backImage" class="text-sm text-gray-600">Back Image</label>
          <input
            id="backImage"
            type="file"
            accept="image/webp"
            class="w-full border-none"
            onchange={(e) => handleFileChange(e, (file) => (backImage = file))}
            required
          />
        </div>
        <div>
          <label for="detailImage" class="text-sm text-gray-600">Detail Image</label>
          <input
            id="detailImage"
            type="file"
            accept="image/webp"
            class="w-full border-none"
            onchange={(e) => handleFileChange(e, (file) => (detailImage = file))}
            required
          />
        </div>
      </div>
    </div>
    <div>
      <label for="category">Category</label>
      <select id="category" class="w-full border p-2" bind:value={category}>
        <option value="shirt">Shirt</option>
        <option value="outerwear">Outerwear</option>
        <option value="bottoms">Bottoms</option>
      </select>
    </div>
    <div>
      <label for="price">Price</label>
      <input
        id="price"
        type="number"
        class="w-full border p-2"
        bind:value={price}
        min="0"
        step="0.01"
        required
      />
    </div>
    <div>
      <label for="quantity">Quantity</label>
      <input
        id="quantity"
        type="number"
        class="w-full border p-2"
        bind:value={quantity}
        min="0"
        required
      />
    </div>
    <button type="submit" class="text-xl">[submit]</button>
  </form>

  <button class="text-xl" onclick={() => (showVariantForm = !showVariantForm)}>
    {#if !showVariantForm}
      [+] add variant
    {:else}
      [-] add variant
    {/if}
  </button>

  <!-- Variant form -->
  {#if showVariantForm}
    <form class="space-y-3 mt-4" onsubmit={addVariant}>
      <div>
        <label for="variantSize">Size</label>
        <select id="variantSize" name="size" class="w-full border p-2">
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
      </div>
      <div>
        <label for="measurements">Measurements (JSON)</label>
        <textarea id="measurements" name="measurements" class="w-full border p-2" rows="3"
        ></textarea>
      </div>
      <button type="submit" class="text-xl">[add]</button>
    </form>
  {/if}
</div>
