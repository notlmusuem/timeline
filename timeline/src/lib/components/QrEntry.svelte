<script lang="ts">
  import QrCode from "./QrCode.svelte";
  import { type DotType, type Options } from "@loskir/styled-qr-code-node";

  import { Entry } from "$lib/models/timeline";
  import logo from "$lib/assets/favicon.png";

  export let entry: Entry;
  export let size: number;
  export let color: boolean = true;
  export let dot_type: DotType = "extra-rounded";
  export let url_origin: string;
  export let ssr: boolean = false;

  let options: Options;
  $: {
    options = {
      data: `${url_origin}/qr/e${entry.id}`,
      width: size,
      height: size,
      image: logo,
      qrOptions: {
        mode: "Byte",
        errorCorrectionLevel: "M",  // L: 7%, M: 15%, Q: 25%, H: 30%
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: size * 0.02,
      },
      dotsOptions: {
        // color: "#440000",
        gradient: {
          type: "linear",
          rotation: (Math.PI * 2 / 360) * 45,
          colorStops: [
            { offset: 0, color: "#9e0814" }, { offset: 1, color: "#9e0814" }
          ]
        },
        type: dot_type,
      },
      backgroundOptions: { color: "#00000000" },
      cornersSquareOptions: { color: "#9e0814" },
      cornersDotOptions: { color: "#000000" },
    };

    if (!color) {
      options.dotsOptions = { color: "#000000", type: dot_type };
      options.cornersSquareOptions = { color: "#000000" };
    }
  }
</script>

<QrCode options={options} {ssr} />
