<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  type FileExtension = "svg" | "png" | "jpeg" | "webp";

  export let options: object;


  let QRCode;
  onMount(async () => {
    ({ default: QRCode } = await import("qr-code-styling"));
  });


  let datauri: string;
  let canvas: HTMLCanvasElement;


  $: if (browser && QRCode !== undefined) {
    (async () => {
      let qr = new QRCode(options);
      let data: Blob = await qr.getRawData("svg");
      datauri = URL.createObjectURL(data);
    })();
  }

  export function download(format: FileExtension) {
    let qr = new QRCode(options);
    qr.download({ name: "qrcode", extension: format });
  }
</script>

<!-- <canvas bind:this={canvas}></canvas> -->
<img src={datauri} alt="QR code" />
