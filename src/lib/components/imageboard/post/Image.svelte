<script lang="ts">
  let { url }: { url: string } = $props();
  let expanded = $state(false);

  function closeModal() {
    expanded = false;
  }
</script>

<button
  type="button"
  onclick={() => (expanded = true)}
  onkeydown={(e) => e.key === 'Enter' && (expanded = true)}
  class="p-0 border-0 bg-transparent"
  aria-label="Expand image"
>
  <img
    src={url}
    alt="post"
    class="w-48 max-h-64 border border-dotted border-black dark:border-white transition-transform"
  />
</button>

{#if expanded}
  <div
    role="dialog"
    aria-label="Expanded image view"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <button
      type="button"
      onclick={closeModal}
      onkeydown={(e) => e.key === 'Escape' && closeModal()}
      class="absolute inset-0 w-full h-full bg-transparent flex items-center justify-center p-5"
      aria-label="Close expanded image"
    >
      <img src={url} alt="post expanded" class="max-w-full max-h-[90vh] object-contain" />
    </button>
  </div>
{/if}
