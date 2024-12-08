<script lang="ts">
  let { width, height }: { width: number; height: number } = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24">
  <rect width="24" height="24" fill="none" />
  <circle cx="12" cy="12" r="0" fill="#05a642">
    <animate
      id="svgSpinnersPulse30"
      fill="freeze"
      attributeName="r"
      begin="0;svgSpinnersPulse32.begin+1.1s"
      calcMode="spline"
      dur="3.3s"
      keySplines=".52,.6,.25,.99"
      values="0;11"
    />
    <animate
      fill="freeze"
      attributeName="opacity"
      begin="0;svgSpinnersPulse32.begin+1.1s"
      calcMode="spline"
      dur="3.3s"
      keySplines=".52,.6,.25,.99"
      values="1;0"
    />
  </circle>
  <circle cx="12" cy="12" r="0" fill="#05a642">
    <animate
      id="svgSpinnersPulse31"
      fill="freeze"
      attributeName="r"
      begin="svgSpinnersPulse30.begin+1.1s"
      calcMode="spline"
      dur="3.3s"
      keySplines=".52,.6,.25,.99"
      values="0;11"
    />
    <animate
      fill="freeze"
      attributeName="opacity"
      begin="svgSpinnersPulse30.begin+1.1s"
      calcMode="spline"
      dur="3.3s"
      keySplines=".52,.6,.25,.99"
      values="1;0"
    />
  </circle>
  <circle cx="12" cy="12" r="0" fill="#05a642">
    <animate
      id="svgSpinnersPulse32"
      fill="freeze"
      attributeName="r"
      begin="svgSpinnersPulse30.begin+2.2s"
      calcMode="spline"
      dur="3.3s"
      keySplines=".52,.6,.25,.99"
      values="0;11"
    />
    <animate
      fill="freeze"
      attributeName="opacity"
      begin="svgSpinnersPulse30.begin+2.2s"
      calcMode="spline"
      dur="3.3s"
      keySplines=".52,.6,.25,.99"
      values="1;0"
    />
  </circle>
</svg>
