<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { structuredCloneProto } from "$lib/utils";

  import { Timeline } from "$lib/models/timeline";
  import Button from "$lib/components/Button.svelte";

  const dispatch = createEventDispatcher();

  export let timeline: Timeline;
  let editing_timeline: Timeline|null = null;

  $: {
    timeline;
    exit_edit(false);
  }

  function enter_edit() {
    editing_timeline = structuredCloneProto(timeline);
  }

  function exit_edit(save = true) {
    if (editing_timeline === null) { return; }

    if (!is_new && save) {
      timeline.name = editing_timeline?.name;
      timeline = timeline;  // reactivity
      dispatch("edit", timeline);
    }

    if (is_new && save) {
      dispatch("create", timeline);
    } else if (is_new && !save) {
      dispatch("create_cancel", timeline);
    }

    editing_timeline = null;
  }

  export let is_first: boolean;
  export let is_last: boolean;
  export let is_new: boolean;

  onMount(() => {
    if (is_new) {
      editing_timeline = timeline;
    }
  })
</script>

<div class='fillw'>
  {#if editing_timeline == null}
    <a href="/timeline/{timeline.id}"
      style="word-break: break-all;"
      >{timeline.name}</a>
  {:else}
    <input type="text" class="input-tl-name"
      placeholder="Timeline name"
      bind:value={editing_timeline.name}
      on:keydown={(event) => {
        if (event.code == "Enter" ) { exit_edit(true); }
        if (event.code == "Escape") { exit_edit(false); }
      }}>
  {/if}
</div>
<div class="btn-row">
  {#if editing_timeline != null}
    <Button alt on:click={() => { exit_edit(true); }}>
      {#if !is_new}
        <i class="material-symbols-rounded">save</i>
        Save Changes
      {:else}
        <i class="material-symbols-rounded">add_box</i>
        Create New
      {/if}
    </Button>
    <Button on:click={() => { exit_edit(false); }}>
      <i class="material-symbols-rounded">cancel</i>
      Cancel
    </Button>
  {:else}
    <Button href="/timeline/{timeline.id}" href_external>
      <i class="material-symbols-rounded">open_in_new</i>
    </Button>
    <Button on:click={() => { enter_edit(); }}>
      <i class="material-symbols-rounded">edit</i>
    </Button>
    <Button disabled={is_first}
      on:click={() => { dispatch("sort_prev", timeline); }}>
      <i class="material-symbols-rounded">arrow_upward</i>
    </Button>
    <Button disabled={is_last}
      on:click={() => { dispatch("sort_next", timeline); }}>
      <i class="material-symbols-rounded">arrow_downward</i>
    </Button>
    <Button on:click={() => { dispatch("delete", timeline); }}>
      <i class="material-symbols-rounded">delete</i>
    </Button>
  {/if}
</div>

<style lang="less">
  *, *::after, *::before {
    box-sizing: border-box;
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--color-text);
    opacity: 0.5;
  }

  input[type="text"],
  input[type="date"],
  select,
  textarea {
    width: 100%;
    padding: 0.9em;

    border-radius: var(--font-size-xsmall) var(--font-size-xsmall) 0 0;
    border: var(--border);
    outline: none;

    background: transparent;
    backdrop-filter: invert(0.1) sepia(0.1) saturate(0.1) brightness(1.1)
    contrast(1.1);
    box-shadow: inset 0 -4px 0 -1px var(--color-theme-1);

    text-overflow: ellipsis;
    text-align: start;
    font-size: var(--font-size-small);
    font-family: var(--font-sans);
    color: var(--color-text);

    transition: all 0.3s var(--curve);
  }

  textarea {
    height: clamp(10rem, 20vh, 30rem);
    resize: none;
  }

  input:focus,
  textarea:focus {
    box-shadow: inset 0 -6px 0 -1px var(--color-theme-1);
  }


  .row {
    display: flex;
    flex-direction: row;
    flex-basis: 100%;
  }

  .btn-row {
    // for parent grid
    justify-content: end;

    display: flex;
    flex-direction: row;
  }

  .btn-row > :global(*) {
    flex: 1 0 auto;
    justify-content: center;
  }

  .fillw {
    width: 100%;
  }
</style>
