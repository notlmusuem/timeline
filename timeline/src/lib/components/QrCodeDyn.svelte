<script lang="ts">
  import { browser } from "$app/environment";
  import { qr } from "$lib/qr";
  import { buffer_to_datauri } from "$lib/utils";

  export let data: string;
  export let size: number;
  export let color: boolean = true;
</script>

{#if !browser}
  <div style="height: {size}px; width: {size}px; aspect-ratio: 1;"></div>
{:else}
  {#await qr(data, {size: size, color: color}).toBuffer("png")}
    <div style="height: {size}px; width: {size}px; aspect-ratio: 1;"></div>
  {:then blob}
    <img src={buffer_to_datauri(blob, "image/png")}
      height="{size}px" width="{size}px"
      alt="A QR code" />
  {/await}
{/if}
