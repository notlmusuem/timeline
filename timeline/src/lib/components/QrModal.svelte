<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  import Modal from "$lib/components/Modal.svelte";
  import QrEntry from "$lib/components/QrEntry.svelte";
  import Button from "$lib/components/Button.svelte";

  import { Entry } from "$lib/models/timeline";

  export let visible: boolean;
  export let entry: Entry;

  let color: boolean = true;

  let qr: QrEntry;
</script>

<div class="modal">
  <Modal bind:visible>
    <h2 slot="header"><b>Generated QR Code</b></h2>

    <div class="hcenter">
      <div class="qr">
        <!-- doing this only triggers reactivity when the modal is open, thus only
        generating qr codes when the modal is open, instead of always -->
        {#if visible}
          <QrEntry {entry} size={2048} {color} bind:this={qr} />
        {/if}
      </div>
    </div>

    <svelte:fragment slot="btns">
      <Button autofocus on:click={() => { color = !color; }}>
        <i class="material-symbols-rounded">palette</i>
        {color ? "Grayscale" : "Color"}
      </Button>
      <Button autofocus on:click={() => { qr.download(); }}>
        <i class="material-symbols-rounded">download</i>Save
      </Button>
      <Button autofocus on:click={() => {}}>
        <i class="material-symbols-rounded">print</i>Print
      </Button>
      <Button autofocus on:click={() => { visible = false; }}>
        <i class="material-symbols-rounded">close</i>Close
      </Button>
    </svelte:fragment>
  </Modal>
</div>

<style>
  .qr {
    aspect-ratio: 1;
    max-width: 15rem;
    max-height: 100%;
  }

  .hcenter {
    display: flex;
    justify-content: center;
  }

  .modal :global(.modal-container) {
    max-width: 25rem;
  }
</style>
