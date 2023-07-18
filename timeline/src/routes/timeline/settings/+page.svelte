<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Modal from '$lib/components/Modal.svelte';

  import { Timeline } from '$lib/models/timeline';
  import { sleep } from '$lib/utils.js';

  export let data;
  let timelines = (data.timelines ?? []).map(Timeline.from_obj);

  let to_delete_timeline: Timeline|null = null;
  let show_delete_modal = false;
  let delete_btn_timer = 0;
  const delete_btn_undo_time = 9;

  function delete_warning(timeline: Timeline) {
    to_delete_timeline = timeline;
    show_delete_modal = true;
  }

</script>

<div class='timeline-grid'>
  {#each timelines as timeline}
    <div class='cell5'><a href='/timeline/{timeline.id}' target='_blank'>{timeline.name}</a></div>
    <div class='cell3 btn-row'>
      <!-- todo: set autofocus  on the first row's button -->
      <Button href='/timeline/{timeline.id}' href_external>
        <i class="material-symbols-rounded">open_in_new</i>
      </Button>
      <Button on:click={() => {  }}>
        <i class="material-symbols-rounded">edit</i>
      </Button>
      <Button on:click={() => {  }}>
        <i class="material-symbols-rounded">arrow_upward</i>
      </Button>
      <Button on:click={() => {  }}>
        <i class="material-symbols-rounded">arrow_downward</i>
      </Button>
      <Button on:click={() => { delete_warning(timeline); }}>
        <i class="material-symbols-rounded">delete</i>
      </Button>
    </div>
  {/each}
</div>

<Modal bind:visible={show_delete_modal}
  on:show={async () => {
    delete_btn_timer = 0;  // reset the timer; and stop it if it's running
  }}
  on:close={() => {
    delete_btn_timer = 0;  // if the delete timer is running; this will stop it!
    to_delete_timeline = null;
  }}>
  <h2 slot="header"><b>Delete timeline</b></h2>
  <div class="small-dialog-msg">
    <p>Are you certain you want to delete the timeline <i style="white-space: nowrap;">{to_delete_timeline?.name}</i>?</p>
    <p><u>All items that are on this timeline will also be deleted!</u>
      This action is unrecoverable and deleted data cannot be restored!</p>
  </div>

  <svelte:fragment slot="btns">
    <Button autofocus on:click={() => {
      delete_btn_timer = 0;  // if the delete timer is running; this will stop it!
      show_delete_modal = false;
      to_delete_timeline = null;
    }}>
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
    <Button alt autofocus loading={delete_btn_timer != 0}
      on:click={async () => {
        for (delete_btn_timer = -1; delete_btn_timer > -delete_btn_undo_time; delete_btn_timer--) {
          await sleep(1000);
          if (delete_btn_timer >= 0 || to_delete_timeline == null) {
            // our timer was reset by extraneous code; bail
            show_delete_modal = false;
            return;
          }
        }

        // make typescript happy
        if (delete_btn_timer >= 0 || to_delete_timeline == null) {
          show_delete_modal = false;
          return;
        }

        // do our delete routine


        // visually delete it from the menu
        const i = timelines.indexOf(to_delete_timeline);
        timelines.splice(i, 1);
        timelines = timelines;  // trigger reactivity

        show_delete_modal = false;
        to_delete_timeline = null;
      }}>
      <i class="material-symbols-rounded">delete_forever</i>
      <u>Delete Forever</u>
    </Button>
  </svelte:fragment>
</Modal>


<style lang="less">
.timeline-grid {
  display: grid;
  grid: auto-flow / repeat(8, 1fr);
  gap: 8px;
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


.small-dialog-msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
}

.small-dialog-msg > * {
  // flex-basis: 15em;
  max-width: 25em;
  text-align: justify;
  margin: 0;
}

</style>
