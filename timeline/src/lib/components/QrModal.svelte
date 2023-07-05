<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  import Modal from "$lib/components/Modal.svelte";
  import QrEntry from "$lib/components/QrEntry.svelte";

  import { Entry } from "$lib/models/timeline";

  export let visible: boolean;
  export let entry: Entry;
</script>

<Modal bind:visible>
  <h2 slot="header"><b>Generated QR Code</b></h2>

  <div class="qr">
    <!-- doing this only triggers reactivity when the modal is open, thus only
    generating qr codes when the modal is open, instead of always -->
    {#if visible}
      <QrEntry {entry} size={2048} url_origin={$page.url.origin} />
    {/if}
  </div>
</Modal>

<style>
  .qr {
    aspect-ratio: 1;
    max-width: 15rem;
    max-height: 100%;
  }
</style>
