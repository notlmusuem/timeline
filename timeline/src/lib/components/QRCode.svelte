<script lang="ts">
  import { AwesomeQR, Options } from "awesome-qr";
  import { ComponentOptions } from "awesome-qr/lib/awesome-qr";

  export let text: string;
  export let size: number | undefined = undefined;
  export let margin: number | undefined = undefined;
  export let correctLevel: number | undefined = undefined;
  export let maskPattern: number | undefined = undefined;
  export let version: number | undefined = undefined;
  export let components: ComponentOptions | undefined = undefined;
  export let colorDark: string | undefined = undefined;
  export let colorLight: string | undefined = undefined;
  export let autoColor: boolean | undefined = undefined;
  export let backgroundImage: string | Buffer | undefined = undefined;
  export let backgroundDimming: string | undefined = undefined;
  export let gifBackground: ArrayBuffer | undefined = undefined;
  export let whiteMargin: boolean | undefined = undefined;
  export let logoImage: string | Buffer | undefined = undefined;
  export let logoScale: number | undefined = undefined;
  export let logoMargin: number | undefined = undefined;
  export let logoCornerRadius: number | undefined = undefined;

  let qr: AwesomeQR;
  $: {
    (async () => {
      qr = new AwesomeQR($$props);
    })();
  }
</script>

<img src={(await qr.draw())?.toString()} alt="QR code" />
