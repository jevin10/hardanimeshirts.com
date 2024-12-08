<script lang="ts">
  import PageTitle from '$lib/components/Heading/PageTitle.svelte';
  import Banner from '$lib/components/Heading/Banner.svelte';
  import { goto } from '$app/navigation';
</script>

<div class="my-10 flex flex-col items-center w-full px-3">
  <PageTitle title={'shipping & handling'} subtitle={''} />
  <div class="flex flex-col items-start mt-[3rem] gap-5 w-full md:w-[45rem]">
    <div class="mb-[1rem]">
      <div class="text-xl">
        hardanimeshirts.com strives to be transparent about its production timelines. You may view
        live updates on the creation of its goods on the
        <button
          class="link"
          onclick={() => {
            goto('/shop/updates');
          }}>updates</button
        > page.
      </div>
    </div>
    <div>
      <div class="text-xs tracking-widest uppercase">shipping information</div>
      <div class="text-base">
        Once your order has been shipped, you will receive an e-mail with your shipment’s tracking
        information, allowing you to keep tabs on the progress of your delivery.
      </div>
      <div class="text-sm italic my-2">
        Please note: tracking information will be updated online one (1) business day after your
        order has been shipped.
      </div>
      <div class="text-base">
        You will become the owner of the goods that you have ordered once they have been delivered
        to your specified delivery address. At this point, the goods become your responsibility and
        hardanimeshirts no longer has any responsibility for taking care of the goods from that
        point.
      </div>
    </div>
    <div>
      <div class="text-xs tracking-widest my-1 uppercase">order processing</div>
      <div class="text-base">
        Once you've ordered an item from hardanimeshirts, it will immediately be added to the
        digital inventory associated with your account. The process of creating the physical good,
        however, may take much longer. Depending on the complexity of the item purchased, one can
        expect the range of the shipping date to be anywhere from 1 to 3 months after the order has
        been processed.
      </div>
    </div>
  </div>
</div>
