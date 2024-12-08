<script lang="ts">
  import PageTitle from '$lib/components/Heading/PageTitle.svelte';
  import Banner from '$lib/components/Heading/Banner.svelte';
</script>

<div class="mt-10 flex flex-col items-center w-full px-3">
  <Banner />
  <PageTitle title={'shipping policy'} subtitle={''} />
  <div class="flex flex-col items-start mt-5 gap-5 w-full md:w-[45rem]">
    <div>
      <div class="text-xs tracking-widest my-1 uppercase">info</div>
      <div class="text-base">Test</div>
    </div>
    <div>
      <div class="text-xs tracking-widest my-1 uppercase">info</div>
      <div class="text-base">Test</div>
    </div>
  </div>
</div>
