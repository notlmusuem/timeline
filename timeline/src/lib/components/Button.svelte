<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { loadingAction } from "svelte-legos";

  const dispatch = createEventDispatcher();
  function click() {
    dispatch("click");
  }
  export let text: string = "Button";
  export let autofocus: boolean = false;
  export let disabled: boolean = false;
  export let href: string|null = null;
  export let alt: boolean = false;
  export let loading: boolean = false;
</script>

<!-- svelte-ignore a11y-autofocus -->
{#if href == null}
  <button use:loadingAction={loading}
    class={alt ? "alt-button" : "button"}
    on:click={click} {disabled} {autofocus}><slot /></button>
{:else}
  <a {href}>
    <button use:loadingAction={loading}
      class={alt ? "alt-button" : "button"}
      on:click={click} {disabled} {autofocus}><slot /></button>
  </a>
{/if}

<style>
  a {
    display: flex;
    margin: 0.5em;
    text-decoration: none !important;
  }
  .button,
  .alt-button {
    user-select: none;
    border-radius: 0.5rem 0.5rem;
    padding: 1em 2em;
    cursor: pointer;
    transition: background-color 0.33s var(--curve), color 0.33s var(--curve);
  }
  .button {
    background: var(--button-background);
    color: var(--button-color);
    border: 2px solid var(--button-border);
  }
  .alt-button {
    background: var(--button-color);
    color: var(--button-hover-color);
    border: 2px solid var(--button-border);
  }
  .button:hover {
    background: var(--button-hover-background);
    color: var(--button-hover-color);
    transition: background-color 0.33s var(--curve);
  }
  .alt-button:hover {
    background: var(--button-active-background);
    color: var(--button-hover-color);
    transition: background-color 0.33s var(--curve);
  }
  .button:disabled,
  .alt-button:disabled {
    background: var(--button-disabled-background);
    color: var(--button-disabled-color);
    border: 2px solid var(--button-disabled-border);
    cursor: default;
  }
  .button:disabled:hover,
  .alt-button:disabled:hover {
    background: var(--button-disabled-background);
    color: var(--button-disabled-color);
  }
  .button:focus,
  .alt-button:focus {
    outline: none;
  }
  .button:active,
  .alt-button:active {
    transition: none;
    background-color: var(--button-active-background);
    transform: scale(0.98);
  }
</style>
