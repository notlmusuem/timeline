<script lang="ts">
  import { browser } from "$app/environment";
  import { createEventDispatcher } from "svelte";
  import { type QRCodeCanvas as QrCode } from "@loskir/styled-qr-code-node";

  import { Entry } from "$lib/models/timeline";
  import { qr_from_entry } from "$lib/qr";
  import { buffer_download, buffer_to_datauri } from "$lib/utils";


  const dispatch = createEventDispatcher();

  export let entry: Entry;
  export let size: number;
  export let color: boolean = true;

  let qr: QrCode;
  let datauri: string|null = null;

  $: {
    entry;
    color;
    datauri = null;
  }

  $: if (browser) {
    qr = qr_from_entry(entry, {
      size: size, color: color
    });

    (async () => {
      datauri = buffer_to_datauri(
        await qr.toBuffer("png"), "image/png"
      );
    })();
  }

  export async function download(size: number|null = null) {
    if (!browser) {
      throw new Error("buffer_download can only be ran in the browser");
    }

    const print_qr = qr_from_entry(entry, {
      size: size ?? $$props.size, color: color
    });
    buffer_download(await print_qr.toBuffer(), "qr.png", "image/png");
  }
</script>


{#if datauri != null}
  <img
    src={datauri} height={size} width={size}
    style="width: 100%; height: auto; aspect-ratio: 1;"
    on:load={async () => {
      dispatch("load");
    }}
    alt="A QR code" />
{:else}
  <div style="padding: 0 auto;">
    <i class="material-symbols-rounded loader">progress_activity</i>
  </div>
{/if}


<style>
  .loader {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
