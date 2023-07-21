<script lang="ts">
  import { tick } from "svelte";
  import supabase from "$lib/supabaseClient.js";
  import { type Writable, writable } from "svelte/store";

  import Button from "$lib/components/Button.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import TimelineLineSetting from "$lib/components/TimelineLineSetting.svelte";

  import { sleep } from "$lib/utils";
  import { Entry, Timeline } from "$lib/models/timeline";

  export let timelines: Writable<Timeline[]>;
  let min_sort: number = 0;
  let max_sort: number = $timelines.length;

  timelines.subscribe((timelines) => {
    for (let i = 0; i < timelines.length; i++) {
      timelines[i].sort = i;
    }

    min_sort = 0;
    max_sort = timelines.length - 1;
  });

  let to_create_timeline: Timeline|null = null;

  let to_delete_timeline: Timeline|null = null;
  let show_delete_modal = false;
  let delete_btn_timer = 0;
  let delete_ref_rows: number|null = null;
  const delete_btn_undo_time = 7;

  function flow_tl_create() {
    to_create_timeline = new Timeline("", $timelines.length);
    $timelines.push(to_create_timeline);
    $timelines = $timelines; // trigger reactivity
  }

  async function flow_tl_create_done(save) {
    if (to_create_timeline == null) {
      throw new Error("not creating a timeline");
    }

    if (!save) {
      $timelines.splice($timelines.indexOf(to_create_timeline));
      $timelines = $timelines;
      to_create_timeline = null;
    } else {
      await to_create_timeline.insert(supabase);
      to_create_timeline = null;
    }
  }

  async function flow_tl_delete(timeline: Timeline) {
    delete_btn_timer = 0;
    to_delete_timeline = timeline;
    show_delete_modal = true;
    delete_ref_rows = null;
    delete_ref_rows = await Entry.count(supabase, timeline);
  }

  async function flow_tl_delete_done() {
    if (to_delete_timeline == null) {
      throw new Error("not deleting a timeline");
    }

    // fixme: perform cascade delete
    await to_delete_timeline.delete(supabase);
    await sync_sorts();

    // visually delete it from the menu
    const i = $timelines.indexOf(to_delete_timeline);
    $timelines.splice(i, 1);
    $timelines = $timelines; // trigger reactivity

    show_delete_modal = false;
    to_delete_timeline = null;
  }

  async function flow_tl_edit(edited: Timeline) {
    await edited.update(supabase);
  }

  async function flow_tl_sort_prev(to_swap: Timeline) {
    const i = $timelines.indexOf(to_swap);
    const swapped = $timelines[i - 1];
    $timelines[i - 1] = to_swap;
    $timelines[i] = swapped;

    await sync_sorts();
  }

  async function flow_tl_sort_next(to_swap: Timeline) {
    const i = $timelines.indexOf(to_swap);
    const swapped = $timelines[i + 1];
    $timelines[i + 1] = to_swap;
    $timelines[i] = swapped;

    await sync_sorts();
  }

  async function sync_sorts() {
    let promises: Promise<Timeline>[] = [];
    for (let i = 0; i < $timelines.length; i++) {
      $timelines[i].sort = i;
      promises.push($timelines[i].update(supabase));
    }

    min_sort = 0;
    max_sort = $timelines.length - 1;

    await Promise.all(promises);
  }
</script>

<div class="timeline-grid">
  {#each $timelines as timeline}
    <TimelineLineSetting
      {timeline}
      is_first={timeline.sort <= min_sort}
      is_last={timeline.sort >= max_sort}
      is_new={to_create_timeline == timeline}
      on:create={() => {
        flow_tl_create_done(true);
      }}
      on:create_cancel={() => {
        flow_tl_create_done(false);
      }}
      on:edit={({ detail: to_edit }) => {
        flow_tl_edit(to_edit);
      }}
      on:delete={({ detail: to_delete }) => {
        flow_tl_delete(to_delete);
      }}
      on:sort_prev={({ detail: to_swap }) => {
        flow_tl_sort_prev(to_swap);
      }}
      on:sort_next={({ detail: to_swap }) => {
        flow_tl_sort_next(to_swap);
      }}
    />
  {/each}

  <div />
  {#if to_create_timeline == null}
    <div class="create-new-btn">
      <Button alt
        on:click={() => { flow_tl_create(); }}>
        <i class="material-symbols-rounded">add</i>
        Create new timeline
      </Button>
    </div>
  {/if}
</div>

<Modal
  bind:visible={show_delete_modal}
  on:show={async () => {
    delete_btn_timer = 0; // reset the timer; and stop it if it"s running
  }}
  on:close={() => {
    delete_btn_timer = 0; // if the delete timer is running; this will stop it!
    to_delete_timeline = null;
  }}
>
  <h2 slot="header"><b>Delete timeline</b></h2>
  <div class="small-dialog-msg">
    <p>
      Are you certain you want to delete the timeline <i
        style="white-space: nowrap;">{to_delete_timeline?.name}?</i
      >
    </p>
    {#if delete_ref_rows != 0}
      <p>
        <u>There is {delete_ref_rows ?? "..."} item{delete_ref_rows == 1 ? "" : "s"} stored on this timeline which will also be deleted, including all text and images!</u>
        Consider backing them up or transfer them to a different timeline first.
      </p>
    {/if}
    <p>
      This action is unrecoverable and deleted data cannot be restored!
      Are you certain you want to do this?
    </p>
  </div>

  <svelte:fragment slot="btns">
    <Button
      autofocus
      on:click={() => {
        delete_btn_timer = 0; // if the delete timer is running; this will stop it!
        show_delete_modal = false;
        to_delete_timeline = null;
      }}
    >
      {#if delete_btn_timer >= 0}
        <i class="material-symbols-rounded">cancel</i>
        <span style="min-width: 8ch;">Cancel</span>
      {:else}
        <i class="material-symbols-rounded">undo</i>
        <!-- delaying the visual timer by 1s fixes a visual problem where the
          time is updated to 0s simulatentously as the item is deleted -->
        <span style="min-width: 8ch;">
          Undo ({Math.max(delete_btn_timer - -delete_btn_undo_time - 1, 0)}s)
        </span>
      {/if}
    </Button>
    <Button
      alt
      autofocus
      loading={delete_btn_timer != 0}
      on:click={async () => {
        for (
          delete_btn_timer = -1;
          delete_btn_timer > -delete_btn_undo_time;
          delete_btn_timer--
        ) {
          await sleep(1000);
          if (delete_btn_timer >= 0 || to_delete_timeline == null) {
            // our timer was reset by extraneous code; bail
            show_delete_modal = false;
            return;
          }
        }

        // just in case
        await tick();
        if (delete_btn_timer >= 0 || to_delete_timeline == null) {
          show_delete_modal = false;
          return;
        }

        // do our delete routine
        flow_tl_delete_done();
      }}
    >
      <i class="material-symbols-rounded">delete_forever</i>
      {#if delete_ref_rows != null && delete_ref_rows > 0}
        <u>Delete {delete_ref_rows} Item{delete_ref_rows == 1 ? "" : "s"} Forever</u>
      {:else}
        <u>Delete Forever</u>
      {/if}
    </Button>
  </svelte:fragment>
</Modal>

<style lang="less">
  .timeline-grid {
    display: grid;
    grid: auto-flow / repeat(2, 1fr);
    gap: 8px;
    align-items: center;
    margin: 0 auto;

    max-width: 45rem;
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
    display: flex;
    flex-direction: row;
  }

  .create-new-btn {
    display: flex;
    & > :global(*) {
      flex-basis: 100%;
      justify-content: center;
    }
  }

  .small-dialog-msg {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    gap: 0.5em;
  }

  .small-dialog-msg > * {
    // flex-basis: 15em;
    max-width: 30em;
    text-align: justify;
    margin: 0;
  }
</style>
