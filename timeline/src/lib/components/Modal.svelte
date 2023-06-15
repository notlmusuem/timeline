<script lang="ts">
  // based on https://svelte.dev/examples/modal from Svelte docs
  import Button from "$lib/components/Button.svelte";

  export let visible: boolean;
  let dialog: HTMLDialogElement;

  $: if (dialog && visible) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
  bind:this={dialog}
  on:close={() => visible = false}
  on:click|self={() => dialog.close()}>
  <div on:click|stopPropagation>
    <slot name="header" />
    <hr />
    <div class=content><slot /></div>
    <hr />
    <slot name="footer" />
    <div class=btn><Button autofocus text={"OK"} on:click={() => dialog.close()}/></div>
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
    min-height: 10rem;
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

  .btn {
    display: flex;
    justify-content: center;
  }
</style>
