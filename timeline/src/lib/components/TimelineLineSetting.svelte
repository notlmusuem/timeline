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

<div>
  {#if editing_timeline == null}
    <a href="/timeline/{timeline.id}" target="_blank"
      style="word-break: break-all;"
      >{timeline.name}</a>
  {:else}
    <input
      type='text' bind:value={editing_timeline.name}
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
        Create
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
  .row {
    display: flex;
    flex-direction: row;
    flex-basis: 100%;
  }

  .cell(@size) {
    grid-column-end: span @size;
  }

  .cell1 { .cell(1); }
  .cell2 { .cell(2); }
  .cell3 { .cell(3); }
  .cell4 { .cell(4); }
  .cell5 { .cell(5); }
  .cell6 { .cell(6); }
  .cell7 { .cell(7); }
  .cell8 { .cell(8); }


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
</style>
