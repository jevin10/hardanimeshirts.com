<script lang="ts">
  let {
    title,
    subtitle
  }: {
    title: string;
    subtitle: string;
  } = $props();
</script>

<div class="w-full flex flex-col items-center">
  <div
    class="font-bold text-[clamp(2.2rem,2.2rem+0.8vw,3rem)] tracking-[clamp(-0.5px,calc(-1px-0.2vw),-3px)] text-center w-full my-0"
  >
    {title}
  </div>
  <div class="text-xl my-0">
    {subtitle}
  </div>
</div>
