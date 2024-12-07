<script lang="ts">
  import PageTitle from '$lib/components/Heading/PageTitle.svelte';
  import Banner from '../components/Banner.svelte';
</script>

<div class="mt-10 flex flex-col items-center w-full px-3">
  <Banner />
  <PageTitle title={'rules & guidelines'} subtitle={''} />
  <div class="text-base w-full md:w-[45rem]">
    The rules of our website are incredibly important! Civil obligations form the basis of any
    society's culture. Rules are enforced at the discretion of site moderation. Email bug reports
    and unban requests to
    <a href="mailto:admin@hardanimeshirts.com" class="link" target="_blank"
      >admin@hardanimeshirts.com</a
    >
  </div>
  <div class="flex flex-col items-center mt-5 gap-5 w-full md:w-[45rem]">
    <div class="w-full gap-1 flex flex-col">
      <div class="w-full border border-black dark:border-white text-xl p-2">
        1. Age Requirements
      </div>
      <div class="w-full p-2">
        - Do not post in or view any boards if you are under 18 years of age.<br />
      </div>
    </div>
    <div class="w-full gap-1 flex flex-col">
      <div class="w-full border border-black dark:border-white text-xl p-2">
        2. Posting Guidelines
      </div>
      <div class="w-full p-2">
        - Always argue in good faith. Avoid using personal attacks unless the user is particularly
        stupid.<br />
        - Do not interact with perceived bait.<br />
        - Do not shill. Shilling will result in a permanent ban.<br />
        - Do not post child pornography or questionable 2D/3DCG/3DPG sexual depictions of children. This
        includes "child models".
      </div>
    </div>
    <div class="w-full gap-1 flex flex-col">
      <div class="w-full border border-black dark:border-white text-xl p-2">
        PRO TIPS FOR MAXIMUM FUN
      </div>
      <div class="w-full p-2">
        - Be smart when posting about potentially illegal activities.<br />
        - You can talk about anything. Just make sure it's board appropriate!<br />
      </div>
    </div>
  </div>
</div>
