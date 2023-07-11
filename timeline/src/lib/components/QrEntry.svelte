<script lang="ts">
  import { browser } from "$app/environment";
  import { QRCodeCanvas as QrCode, type DotType, type Options } from "@loskir/styled-qr-code-node";

  import { Entry } from "$lib/models/timeline";
  import { qr_from_entry } from "$lib/qr";
  import { buffer_download, buffer_to_datauri } from "$lib/utils";

  export let entry: Entry;
  export let size: number;
  export let color: boolean = true;
  export let ssr: boolean = false;

  let qr: QrCode;

  $: if (browser || ssr) {
    qr = qr_from_entry(entry, {
      size: size, color: color
    });
  }

  export async function download() {
    buffer_download(await qr.toBuffer(), "qr.png", "image/png");
  }
</script>

{#await qr.toBuffer("png")}
  <div style={`height: ${size}px; width: ${size}px;`}></div>
{:then buffer}
  <img src={buffer_to_datauri(buffer, "image/png")} height={size} width={size}
  alt="A QR code" />
{/await}

<style>
  img {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
  }
</style>
