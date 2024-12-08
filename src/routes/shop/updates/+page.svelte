<script>
  import PageTitle from '$lib/components/Heading/PageTitle.svelte';
  import PulseIcon from './components/PulseIcon.svelte';
</script>

<div class="mt-10 flex flex-col items-start">
  <div class="flex flex-row items-center">
    <PageTitle title={'live updates'} subtitle={''} />
    <div class="mt-1 md:mt-2 mx-1">
      <PulseIcon width={40} height={40} />
    </div>
  </div>
  <div class="my-5">
    <div class="text-xl">There are no updates to show.</div>
  </div>
</div>
