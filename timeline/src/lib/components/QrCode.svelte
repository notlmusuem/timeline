<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { QRCodeCanvas as QRCode, type Options } from "@loskir/styled-qr-code-node";

  type FileExtension = "svg" | "png" | "jpeg" | "webp";

  export let options: Options;
  export let ssr: boolean = false;


  async function generate_qr(options: Options): Promise<string> {
    const qr = new QRCode(options);
    const data: Buffer = await qr.toBuffer("png");

    if (browser) {
      const blob = new Blob([data], { type: "image/png" });
      return URL.createObjectURL(blob);
    } else {
      return `data:image/png;base64,${data.toString("base64")}`;
    }
  }
</script>

<!-- <canvas bind:this={canvas}></canvas> -->
{#await generate_qr(options)}
  <span>loading...</span>
{:then datauri}
  <img src={datauri} alt="QR code"
    height={options.height ?? undefined}
    width={options.width ?? undefined} />
{/await}

<style>
  img {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
  }
</style>
