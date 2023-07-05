<script lang="ts">
  import { onMount } from "svelte";

  import Modal from "$lib/components/Modal.svelte";
  import QrCode from "./QRCode.svelte";
  import logo from "$lib/assets/notl-museum.svg";

  import { Entry } from "$lib/models/timeline";


  export let visible: boolean;
  export let entry: Entry;


  let url = "";

  onMount(() => {
    url = `${location.origin}/timeline/${entry.timeline.id}/${entry.id}`;
  });
</script>


<Modal bind:visible={visible}>
  <h2 slot="header"><b>Generated QR Code</b></h2>

  <QrCode options={{
      data: url,
      type: "svg",
      image: "/favicon.png",
      qrOptions: {
        mode: "Byte",
        errorCorrectionLevel: "M",  // L: 7%, M: 15%, Q: 25%, H: 30%
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 4,
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
        type: "extra-rounded",
      },
      backgroundOptions: { color: "#00000000" },
      // cornersSquareOptions: { color: "#000000" },
      cornersDotOptions: { color: "#000000" },
    }}
    />
</Modal>
