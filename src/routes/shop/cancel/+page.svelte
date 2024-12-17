<script>
  import { goto } from '$app/navigation';
</script>

<div class="text-xl">You have canceled your order.</div>
<div class="base">
  <button
    onclick={() => {
      goto('/');
    }}>[go home]</button
  >
</div>
