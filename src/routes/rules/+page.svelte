<script lang="ts">
  import PageTitle from '$lib/components/Heading/PageTitle.svelte';
  import Banner from '../components/Banner.svelte';
</script>

<div class="mt-10 flex flex-col items-center w-full px-3">
  <PageTitle title={'global rules'} subtitle={''} />
  <div class="text-base w-full md:w-[45rem] mt-[3rem]">
    The rules of our website are incredibly important! Civil obligations form the basis of any
    society's culture. Rules are enforced at the discretion of site moderation.
  </div>
  <div class="flex flex-col items-center mt-5 gap-5 w-full md:w-[45rem]">
    <div class="w-full flex flex-col">
      <div class="text-xs tracking-widest my-1 uppercase">Age requirements</div>
      <div class="w-full">
        - Do not post in or view any boards if you are under 18 years of age.<br />
      </div>
    </div>
    <div class="w-full flex flex-col">
      <div class="text-xs tracking-widest my-1 uppercase">Posting guidelines</div>
      <div class="w-full">
        - Always argue in good faith. Avoid using personal attacks unless the user is particularly
        stupid.<br />
        - Do not interact with perceived bait.<br />
        - Do not shill. Shilling will result in a permanent ban.<br />
        - Do not post child pornography or questionable 2D/3DCG/3DPG sexual depictions of children. This
        includes "child models".
      </div>
    </div>
    <div class="w-full flex flex-col">
      <div class="text-xs tracking-widest my-1 uppercase">pro tips for maximum fun</div>
      <div class="w-full">
        - Be smart when posting about potentially illegal activities.<br />
        - You can talk about anything. Just make sure it's board appropriate!<br />
      </div>
    </div>
    <div class="my-[3rem] flex flex-col items-center gap-5">
      <div class="flex flex-col items-center">
        <div class="text-3xl">suggest a rule</div>
        <a href="mailto:admin@hardanimeshirts.com" class="link my-1 text-xl" target="_blank"
          >admin@hardanimeshirts.com</a
        >
      </div>
      <div class="flex flex-col my-1 items-center">
        <div class="text-3xl">complain about a rule</div>
        <a href="https://www.adl.org/contact" class="link my-1 text-xl" target="_blank"
          >adl.org/contact</a
        >
      </div>
    </div>
  </div>
</div>
