<script>
  import { goto } from '$app/navigation';
</script>

<div class="text-2xl">Navigation</div>
<button onclick={() => goto('/admin/products')}>Products</button>
