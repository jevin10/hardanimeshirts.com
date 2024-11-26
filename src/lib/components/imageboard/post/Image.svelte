<script lang="ts">
  let { url }: { url: string } = $props();
</script>

<img class="w-48 max-h-64" src={url} alt="post" />
