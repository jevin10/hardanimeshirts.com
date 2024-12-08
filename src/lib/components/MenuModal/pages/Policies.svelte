<script lang="ts">
  import { goto } from '$app/navigation';
  import { getMenuModalState, type MenuModalState } from '../MenuModalState.svelte';

  const menuModalState: MenuModalState = getMenuModalState();

  function navigate(target: string) {
    menuModalState.closeModal();
    goto(target);
  }
</script>

<button
  onclick={() => {
    menuModalState.page = 'Main';
  }}>[back]</button
>
<div class="flex flex-col gap-[3rem]">
  <div>
    <div class="text-lg my-1">Read our policies.</div>
    <div class="text-sm">
      These policies are incredibly boring. We'll be impressed if you read all of them. We don't
      really expect you to.
    </div>
    <div class="my-3 flex flex-col items-start">
      <button
        onclick={() => {
          navigate('/rules');
        }}>Global Rules</button
      >
      <button
        onclick={() => {
          navigate('/policies/shipping');
        }}>Shipping Policy</button
      >
    </div>
  </div>
</div>
