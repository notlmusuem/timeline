<script lang="ts">
  import { tick } from "svelte";

  import Button from "$lib/components/Button.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import QrEntry from "$lib/components/QrEntry.svelte";
  import PrintFrame from "$lib/components/PrintFrame.svelte";

  import { qr_entry_link } from "$lib/qr";
  import { sleep } from "$lib/utils";
  import { Entry } from "$lib/models/timeline";

  export let visible: boolean;
  export let entry: Entry;

  let color: boolean = true;

  let qrEntry: QrEntry;
  let printable: PrintFrame;
  let printDialog = false;

  let preview_size: number = 512;
  let print_size: number = 1.25;
  let print_size_unit: "cm"|"in" = "in";
  $: if (visible) { preview_size = 512; }

  let loading_hires = false;

  let printing = false;
  let saving = false;
</script>

<div class="qr_modal">
  <Modal bind:visible>
    <h2 slot="header"><b>Generated QR Code</b></h2>

    <div class="hcenter">
      <caption>Code linking to <a href={qr_entry_link(entry)} target="_blank"><i>“{entry.title}”</i></caption>
      <div class="qr" on:focus on:mouseover={async () => {
        // upgrade the image size on mouse over just in case the user tries to
        // right click copy image
        if (preview_size != 8192) {
          preview_size = 8192;
          loading_hires = true;
        }
      }} on:contextmenu={(event) => {
        // stop the user from accidentally copying the lower res image
        if (loading_hires) { event.preventDefault(); }
      }}>
        <!-- doing this only triggers reactivity when the modal is open, thus only
        generating qr codes when the modal is open, instead of always -->
        {#if visible}
          <QrEntry {entry} size={preview_size} {color}
            bind:this={qrEntry} on:load={async () => {
              await sleep(400);
              loading_hires = false;
            }} />
        {/if}
      </div>
      {#if loading_hires}
        <caption>
          Loading high resolution code
          <i class="material-symbols-rounded loader">progress_activity</i>
        </caption>
      {/if}
    </div>

    <PrintFrame component={QrEntry} props={{
      entry: entry,
      size: 8192,
      color: color
    }} bind:this={printable} />

    <svelte:fragment slot="btns">
      <Button autofocus on:click={() => { color = !color; }}>
        <i class="material-symbols-rounded">palette</i>
        {color ? "Color" : "Grayscale"}
      </Button>
      <Button autofocus loading={saving}
        on:click={async () => {
          saving = true;
          await tick();
          await sleep(10);
          await qrEntry.download(8192);
          saving = false;
          visible = false;
        }}><i class="material-symbols-rounded">download</i>Save
      </Button>
      <Button autofocus loading={printDialog}
        on:click={async () => { printDialog = true; }}>
        <i class="material-symbols-rounded">print</i>Print
      </Button>
      <Button autofocus on:click={() => { visible = false; }}>
        <i class="material-symbols-rounded">close</i>Close
      </Button>
    </svelte:fragment>
  </Modal>
</div>
<div class='print_modal'>
  <Modal bind:visible={printDialog}>
    <h2 slot="header"><b>Print Settings</b></h2>

    <div class='hcenter'>
      <label for='qr_size'>Size/Width of Code</label>
      <div>
        <input id='qr_size' type='number'
          min=0.01 max={print_size_unit == "in" ? 12 : 12 * 2.54}
          step=0.10 maxlength=5
          bind:value={print_size} on:change={() => {
            let max = print_size_unit == "in" ? 12 : 12 * 2.54;
            print_size = Math.min(Math.max(print_size, 0.1), max);
          }}>
        <select id='qr_size_unit' bind:value={print_size_unit} on:change={() => {
          if (print_size_unit == "cm") {
            print_size = print_size * 2.54;
          } else {
            print_size = print_size / 2.54;
          }
        }}>
          <option value="in">inches</option>
          <option value="cm">centimeters</option>
        </select>
      </div>

      <label for='qr_size'>Color or Grayscale Printing</label>
      <Button autofocus on:click={() => { color = !color; }}>
        <i class="material-symbols-rounded">palette</i>
        {color ? "Print in Color" : "Print in Grayscale"}
      </Button>
      <p class='sublabel'>When printing on a non-color printer, set the above toggle to grayscale for better contrast.</p>
    </div>

    <svelte:fragment slot="btns">
      <Button autofocus on:click={() => {
        printing = false;
        printDialog = false;
      }}>
        <i class="material-symbols-rounded">cancel</i>Cancel
      </Button>

      <Button autofocus loading={printing}
        on:click={async () => {
          printing = true;
          await printable.refresh(`${print_size}${print_size_unit}`, true);
          await printable.print();
          printable.destroy();
          printing = false;
          printDialog = false;
          visible = false;
        }}><i class="material-symbols-rounded">print</i>Print
      </Button>
    </svelte:fragment>
  </Modal>
</div>

<style>
  caption {
    font-size: var(--font-size-xsmall);
  }

  caption .material-symbols-rounded {
    font-size: var(--font-size-xsmall);
    vertical-align: middle;
  }

  label {
    font-size: 1em;
    padding-left: 1rem;
    color: var(--color-text);
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--color-text);
    opacity: 0.5;
  }

  input, select, textarea {
    text-overflow: ellipsis;
    flex: 1 1 auto;
    text-align: left;
    margin: 0.5em 0;
    padding: 0.9em;
    border-radius: var(--font-size-xsmall) var(--font-size-xsmall) 0 0;
    outline: none;
    border: none;
    background: transparent;
    backdrop-filter: invert(0.1) sepia(0.1) saturate(0.1) brightness(1.1)
      contrast(1.1);
    font-size: var(--font-size-small);
    color: var(--color-text);
    font-family: var(--font-sans);
    box-shadow: inset 0 -4px 0 -1px var(--color-theme-1);
    transition: all 0.3s var(--curve);
  }

  textarea {
    height: clamp(10rem, 20vh, 30rem);
    resize: none;
  }

  input:focus, textarea:focus {
    box-shadow: inset 0 -6px 0 -1px var(--color-theme-1);
  }


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

  .qr {
    aspect-ratio: 1;
    max-width: 13rem;
    max-height: 100%;
  }

  .hcenter {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25em;
  }

  .qr_modal :global(.modal-container) {
    max-width: 20rem;
  }

  .print_modal :global(.modal-container) {
    max-width: 20rem;
  }

  .sublabel {
    font-size: var(--font-size-xsmall);
  }

  #qr_size {
    max-width: 4em;
  }

  #qr_size_unit {
    min-width: 1em;
    width: auto;
  }
</style>
