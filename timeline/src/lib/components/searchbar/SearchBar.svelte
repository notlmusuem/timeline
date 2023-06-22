<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import DropDownItem from "$lib/components/searchbar/DropDownItem.svelte";
  import { mode } from "$lib/stores/store";

  import { Entry } from "$lib/models/timeline";

  export let selection: Entry|null = null;
  export let data: Entry[];

  let disabled: boolean;
  let clicked: boolean = false;
  let search: string = "";
  let filtered: Entry[] = [];

  $: disabled = $mode !== "default";

  function performSearch() {
    const keywords = search.toLowerCase().trim().split(" ");

    filtered = data
      .filter(entry => {
        return keywords.every(keyword =>
          // todo: maybe format the entire date here? or at least the end date?
          `${entry.title.toLowerCase().trim()} ${entry.start_date.getUTCFullYear()}`
            .includes(keyword)
        );
      })
      .slice(0, 10); // max 10
  };

  function handleClickOutside(event) {
    if (event.target.closest(".search-container")) { return; }
    clicked = true;
  }

  function handleShortcut(event) {
    if ((event.key == "/" || event.key == "?") && !event.target.closest("input")) {
      event.preventDefault();
      document.querySelector("html")?.scrollTo(0, 0);
      document.querySelector("input")?.focus();
    }
  }
</script>

<svelte:window on:click={handleClickOutside} on:keydown={handleShortcut} />

<div
  class="search-container"
  style={disabled ? `top: -4rem !important;` : ``}
  transition:fly={{y:-25}}>
  <div class="bar">
    <input
      type="text"
      {disabled}
      placeholder="Search"
      class={clicked && filtered.length == 0 && !search
        ? "search-box"
        : "search-box has-results"}
      bind:value={search}
      on:click={() => (clicked = false)}
      on:input={() => {
        performSearch();
        clicked = false;
      }} />
    {#if search}
      <span
        class="material-symbols-rounded i"
        on:keydown
        on:click={() => (search = "")}>
        close
      </span>
    {:else}
      <span class="material-symbols-rounded i">search</span>
    {/if}
  </div>

  {#if search && !clicked && filtered.length > 0}
    <div class="results">
      {#each filtered as item}
        <DropDownItem
          on:selection={() => {
            clicked = true;
            selection = item;

            search = "";  // void the search input
          }}>
          <b>{item.start_date.getFullYear()}</b> • {item.title}
        </DropDownItem>
      {/each}
    </div>
  {:else if search == ""}
    <div class="results" style="pointer-events: none;">
      <DropDownItem color="grey" on:selection={() => {
        selection = null;
      }}>
        Type something...
      </DropDownItem>
    </div>
  {:else}
    <div class="results" style="pointer-events: none;">
      <DropDownItem color="grey" on:selection={() => {
        selection = null;
      }}>
        No results...
      </DropDownItem>
    </div>
  {/if}
</div>

<style>
  :root {
    --width: calc(20 * var(--font-size-base));
    --height: calc(2 * var(--font-size-base));
  }

  .search-container {
    position: fixed;
    top: calc(1.85rem + (var(--font-size-xsmall) * -1));
    right: calc(5rem + var(--font-size-base));
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    border: 2px solid transparent;
    border-radius: var(--font-size-xsmall);
    width: clamp(8rem, 30vw, 30rem);
    z-index: 999;
    box-shadow: 3px 3px 16px 0 #00000000;
    transition: opacity 0.1s var(--curve), width 0.5s var(--curve),
      right 0.5s var(--curve), border 0.1s var(--curve), top 0.5s var(--curve),
      box-shadow 0.5s var(--curve);
  }

  .search-container:focus-within {
    border: 2px solid var(--color-theme-1);
    box-shadow: 3px 3px 16px 0 #00000040;
    width: calc(50vw - 2rem);
  }

  .bar {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .search-box {
    color: var(--color-text);
    height: var(--height);
    width: 100%;
    border: none;
    box-shadow: 0 0 0 2px #bbb;
    padding: 0.1rem 0 0.1rem 1.5rem;
    border-radius: var(--font-size-xsmall);
    font-size: var(--font-size-small);
    background: var(--color-bg-1);
    transition: all 0.3s var(--curve);
  }

  .search-box:focus {
    outline: none;
    box-shadow: 0 0 0 0px var(--color-theme-1);
    border-bottom: none;
  }

  .has-results:focus {
    border-radius: var(--font-size-xsmall) var(--font-size-xsmall) 0 0;
  }

  .search-container:focus-within .search-box {
    padding: 0.5rem 0 0.5rem 1.5rem;
  }

  .search-container:focus-within > .results {
    opacity: 1;
    height: auto;
  }

  .results {
    opacity: 0;
    height: -100px;
    width: 100%;
    overflow: hidden;
    background: var(--color-bg-1);
    border-radius: 0 0 var(--font-size-xsmall) var(--font-size-xsmall);
    transition: all 0.3s var(--curve);
  }

  .i {
    position: absolute;
    right: calc(0.75 * var(--font-size-base));
    font-size: var(--font-size-base);
    color: var(--color-text);
  }

  @media (max-width: 1000px) {
    .search-container {
      width: 9rem;
    }
    .search-container:focus-within {
      width: calc(100vw - 2rem);
      right: 1rem;
    }
    .search-container:focus-within .search-box {
      padding: 1rem 0 1rem 1.5rem;
    }
  }
</style>
