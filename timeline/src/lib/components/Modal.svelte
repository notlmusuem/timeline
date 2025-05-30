<script lang="ts">
  // based on https://svelte.dev/examples/modal from Svelte docs
  import Button from "$lib/components/Button.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let visible: boolean;
  let dialog: HTMLDialogElement;

  $: if (dialog && visible) {
    dialog.showModal();
    dispatch("show", self);
  }

  $: if (dialog && !visible) {
    dialog.close();
    dispatch("close", self);
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
  bind:this={dialog}
  on:close={() => { visible = false; }}
  on:click|self={() => { visible = false; }}>
  <div on:click|stopPropagation class="modal-container">
    <slot name="header" />
    <hr />
    <div class="content"><slot /></div>
    <hr />
    <slot name="footer" />
    <div class="btns">
      <!-- use <svelte:fragment slot="btns"> for this slot to avoid creating
      a wrapper element -->
      <slot name="btns">
        <Button autofocus on:click={() => { visible = false; }}>Ok</Button>
      </slot>
    </div>
  </div>
</dialog>

<style>
  dialog {
    max-width: 40em;
    background: var(--color-bg-2);
    color: var(--color-text);
    border-radius: 2rem;
    border: var(--border);
    padding: 0;
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
    transition:all 0.5s var(--curve);
  }

  hr {
    border: none;
    border-top: 1px solid var(--color-text);
    opacity: 0.33;
  }

  dialog > div {
    padding: .5em 1em;
  }

  .content {
    max-height: 50vh;
    min-height: 5rem;
    overflow-y: scroll;
  }

  dialog[open] {
    animation: zoom 0.5s var(--curve);
  }

  @keyframes zoom {
    from {
      transform: scale(0.8);
    }
    to {
      transform: scale(1);
    }
  }

  dialog[open]::backdrop {
    animation: fade 0.5s var(--curve);
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .btns {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
</style>
