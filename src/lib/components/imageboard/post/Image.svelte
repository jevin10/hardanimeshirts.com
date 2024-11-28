<script lang="ts">
  let { url }: { url: string } = $props();
</script>

<img
  class="w-48 max-h-64 border border-dotted border-black dark:border-white"
  src={url}
  alt="post"
/>
