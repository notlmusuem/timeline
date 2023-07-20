<script lang="ts">
  import { writable, type Writable } from "svelte/store";

  import { Timeline } from "$lib/models/timeline";
  import TimelineSetting from "$lib/components/TimelineSetting.svelte";

  export let data;
  let timelines: Writable<Timeline[]> = writable(
    (data.timelines ?? []).map(Timeline.from_obj)
  );
</script>

<TimelineSetting timelines={timelines} />

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
