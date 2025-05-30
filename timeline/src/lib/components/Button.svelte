<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { loadingAction } from "svelte-legos";
  import * as navigation from "$app/navigation";


  const dispatch = createEventDispatcher();

  export let autofocus: boolean = false;
  export let disabled: boolean = false;
  export let title: string|null = null;
  export let href: string|null = null;
  export let href_external: boolean = false;
  export let alt: boolean = false;
  export let loading: boolean = false;
</script>

<!-- svelte-ignore a11y-autofocus -->
{#if href == null}
  <button use:loadingAction={loading}
    class={alt ? "alt-button nolink" : "button nolink"}
    on:click={() => { dispatch("click"); }}
    {title} {disabled} {autofocus}><div><slot /></div></button>
{:else}
  <a {href} target={href_external ? "_blank" : undefined}
    on:click={(event) => {
      // Svelte is very dumb & inconsistent sometimes... the magic link handling
      // for svelte apparently doesn't trigger on links in components which are
      // dynamically shown with {#if} blocks only if they are hidden by default
      // in the ssr. why?
      if (!href_external) {
        // this code wont execute anyways until svelte has hydrated the page
        // before that, it'll act just like a normal link; exactly what we want
        navigation.goto(href ?? "", { replaceState: false });
        event.preventDefault();
      }
      dispatch("click");
    }}>
    <button use:loadingAction={loading}
      class={alt ? "alt-button" : "button"}
      on:click={() => { dispatch("click"); }}
      {title} {disabled} {autofocus}><div><slot /></div></button>
  </a>
{/if}

<style lang="less">
  a, .nolink {
    display: flex;
    justify-content: space-around;
    margin: 0.5em;
    text-decoration: none !important;
  }

  a > button {
    flex-basis: 100%;
  }

  .button,
  .alt-button {
    font-size: var(--font-size-small);

    border: 2px solid var(--button-border);
    border-radius: 0.5rem 0.5rem;
    padding: 0.75em 1.25em;

    cursor: pointer;
    user-select: none;
    transition: background-color 0.33s var(--curve), color 0.33s var(--curve);

    // the content inner container
    & > div {
      min-height: var(--font-size-medium);
      white-space: nowrap;

      display: inline-flex;
      gap: 0.5em;
      justify-content: center;
      align-items: center;

      & :global(.material-symbols-rounded) {
        font-size: var(--font-size-medium);
      }
    }

    &:hover {
      transition: background-color 0.33s var(--curve);
    }

    &:active {
      transition: none;
      background-color: var(--button-active-background);
      transform: scale(0.98);
    }

    &:disabled {
      background: var(--button-disabled-background);
      color: var(--button-disabled-color);
      border: 2px solid var(--button-disabled-border);
      cursor: default;

      &:hover {
        background: var(--button-disabled-background);
        color: var(--button-disabled-color);
      }
    }
  }

  .button {
    background: var(--button-background);
    color: var(--button-color);
  }

  .alt-button {
    background: var(--button-color);
    color: var(--button-hover-color);
  }

  .button:hover {
    background: var(--button-hover-background);
    color: var(--button-hover-color);
  }

  .alt-button:hover {
    background: var(--button-active-background);
    color: var(--button-hover-color);
  }
</style>
