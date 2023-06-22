<script lang="ts">
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { quintOut } from "svelte/easing";
  import { writable } from "svelte/store";
  import supabase from "$lib/supabaseClient";

  import { windowWidth } from "$lib/stores/window";
  import { direction, mode } from "$lib/stores/store";
  import { year, atStart, atEnd } from "$lib/stores/store";
  import { currentItemIndexStore } from "$lib/stores/store";

  import ItemTransition from "$lib/components/ItemTransition.svelte";
  import TimelineBar from "$lib/components/TimelineBar.svelte";
  import SearchBar from "$lib/components/searchbar/SearchBar.svelte";
  import ItemComponents from "$lib/components/ItemComponents.svelte";
  import PageTransitionFade from "$lib/components/PageTransitionFade.svelte";
  import EventEdit from "$lib/components/EventEdit.svelte";
  import EditorModal from "$lib/components/EditorModal.svelte";
  import QuickStartModal from "$lib/components/QuickStartModal.svelte";

  import { Entry } from "$lib/models/timeline";
  import { sleep } from "$lib/utils";

  export let data;
  let timeline: Entry[] = data.timeline.map(o => Entry.from_obj(o));


  // map timeline titles and years to searchData
  let searchData: { title: string; year: number; }[] = [];
  $: {
    searchData = timeline.map((item) => {
      return {
        title: item.title,
        // todo: support proper dates
        year: item.start_date.getFullYear(),
      };
    });
  }

  let itemIndex = 0;
  currentItemIndexStore.subscribe((value) => {
    itemIndex = value;
  });

  let dropDownSelection = "";
  let selectedItem = timeline[0];
  let currentIndex = 0;
  let editingItem = Entry.new_default();

  let modalQuickStart: boolean = false;
  let modalEditorGuide: boolean = false;

  let touchStartX = 0;
  let touchEndX = 0;
  let touchDeltaX = 0;

  const itemTranslateX = tweened(0, {
    duration: 300,
    easing: quintOut,
  });

  const opacity = writable(1);

  $: atStart.set(currentIndex == 0);
  $: atEnd.set(currentIndex == timeline.length - 1);

  function pageDown() {
    selectedItem = timeline[++currentIndex];
    update();
  }

  function pageUp() {
    selectedItem = timeline[--currentIndex];
    update();
  }

  // checks for multiple events in a year when dot on timeline is clicked
  async function multipleEventsCheck() {
    year.set(selectedItem.start_date.getUTCFullYear());

    currentIndex = timeline.indexOf(selectedItem);
    currentItemIndexStore.set(currentIndex);
    const indexDate = timeline[currentIndex].start_date.getUTCFullYear();
    for(var i=0; timeline.length; i++)
    {
      if(timeline[i].start_date.getUTCFullYear() == indexDate)
      {
        currentIndex = i;
        currentItemIndexStore.set(currentIndex);
        break;
      }
    }
  }

  async function update() {
    year.set(selectedItem.start_date.getFullYear());

    currentIndex = timeline.indexOf(selectedItem);
    currentItemIndexStore.set(currentIndex);
  }

  function gotoItem() {
    let item = timeline.find(item => item.title == dropDownSelection);
    if (item) {
      selectedItem = item;
      if (timeline.indexOf(selectedItem) > currentIndex) {
        $direction = "down";
      } else if (timeline.indexOf(selectedItem) < currentIndex) {
        $direction = "up";
      }
      update();
    }
  }

  $: add = Entry.new_default();

  function handleCreate({ detail: new_entry }) {
    timeline.push(new_entry);
    timeline.sort((l, r) => l.start_date.getTime() - r.start_date.getTime())

    currentIndex = timeline.findIndex(entry => entry.id == new_entry.id);
    selectedItem = timeline[currentIndex];
    currentItemIndexStore.set(currentIndex);
    update();
    mode.set("add");
    mode.set("default");
  }

  function handleUpdate({ detail: new_entry }) {
    console.log("updated entry", new_entry)
    let idx = timeline.findIndex(entry => entry.id == new_entry.id);
    if (idx != -1) {
      timeline[idx] = new_entry;
    }

    timeline.sort((l, r) => l.start_date.getTime() - r.start_date.getTime())
    idx = timeline.findIndex(entry => entry.id == new_entry.id);

    currentIndex = idx;
    selectedItem = timeline[currentIndex];
    currentItemIndexStore.set(currentIndex);
    update();
    mode.set("add");
    mode.set("default");
  }

  function handleDelete({ detail: rm_entry }) {
    let idx = timeline.findIndex(entry => entry.id == rm_entry.id);
    if (idx != -1) {
      timeline.splice(idx, 1);
    }

    selectedItem = timeline[currentIndex--];
    currentItemIndexStore.set(currentIndex);

    if (timeline.length >= 1) {
      update();
      mode.set("add");
      mode.set("default");
    }
  }

  async function fetchTimelineData() {
    timeline = await Entry.select_all(supabase);
    update();
  }

  function handleTouchStart(event) {
    if (
      event.touches[0].clientX < 128 ||
      event.touches[0].clientY < 128 ||
      $mode !== "default"
    ) { return; }
    touchStartX = event.touches[0].clientX;
  }

  function handleTouchMove(event) {
    if (
      event.touches[0].clientX < 128 ||
      event.touches[0].clientY < 128 ||
      $mode !== "default"
    ) { return; }
    touchEndX = event.touches[0].clientX;
    if (Math.abs(touchEndX - touchStartX) < 60) return;
    touchDeltaX = touchEndX - touchStartX;
    itemTranslateX.set(touchDeltaX);
    opacity.set(1 - Math.abs(touchDeltaX) / 750);
  }

  async function handleTouchEnd() {
    if (Math.abs(touchDeltaX) > 60) {
      if (touchDeltaX > 100) {
        if (!$atStart) {
          $direction = "none";
          await pageUp();
          $opacity = 0;
          $itemTranslateX = -250;
        }
      } else if (touchDeltaX < -100) {
        if (!$atEnd) {
          $direction = "none";
          await pageDown();
          $opacity = 0;
          $itemTranslateX = 250;
        }
      }
      sleep(250).then(() => {
        resetSwipe();
      });
    }
  }

  function resetSwipe() {
    touchDeltaX = 0;
    $opacity = 1;
    $itemTranslateX = 0;
  }

  let firstVisit: boolean = false;
  $: if (firstVisit) {
    modalQuickStart = true;
    firstVisit = false;
    localStorage.setItem("firstVisit", "false");
  }

  let firstTimeEditor: boolean = false;
  $: if (firstTimeEditor && $mode != "default") {
    modalEditorGuide = true;
    firstTimeEditor = false;
    localStorage.setItem("firstTimeEditor", "false");
  }

  onMount(() => {
    firstVisit = localStorage.getItem("firstVisit") == null;
    firstTimeEditor = localStorage.getItem("firstTimeEditor") == null;

    const timelineChannel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "timeline" },
        () => {
          fetchTimelineData();
        }
      )
      .subscribe();

    if (timeline.length > 0 && itemIndex !== 0) {
      currentIndex = itemIndex;
      selectedItem = timeline[itemIndex];
      update();
    }

    return () => {
      supabase.removeChannel(timelineChannel);
    };
  });
</script>

<svelte:head>
  <title>Timeline | Niagara-on-the-Lake Timeline</title>
  <meta name="description" content="Timeline page" />
</svelte:head>

<svelte:window
  on:touchend={handleTouchEnd}
  on:touchmove|passive={handleTouchMove} />

<QuickStartModal bind:visible={modalQuickStart} />

<EditorModal bind:visible={modalEditorGuide} />

<SearchBar
  bind:selection={dropDownSelection}
  data={searchData}
  on:selection={gotoItem}
  on:selection={update} />

<TimelineBar
  timeData={timeline}
  bind:modalQuickStart={modalQuickStart}
  bind:modalEditorGuide={modalEditorGuide}
  bind:currentItem={selectedItem}
  on:change={multipleEventsCheck}
  on:pagedown={pageDown}
  on:pageup={pageUp} />

<EventEdit
  entry={editingItem}
  on:entryCreate={handleCreate}
  on:entryUpdate={handleUpdate}
  on:entryDeleted={handleDelete} />

{#if timeline.length > 0}
  <PageTransitionFade>
    {#key `${selectedItem.id}-${$direction}`}
      <section
        class="layout"
        style="transform-origin:bottom center;transform: translateX({$itemTranslateX}px) rotate({$itemTranslateX /
          ($windowWidth / 5)}deg);opacity:{$opacity};"
        on:touchstart|passive={handleTouchStart}>
        <ItemTransition>
          <ItemComponents
            bind:editingItem={editingItem}
            entry={selectedItem} />
        </ItemTransition>
      </section>
    {/key}
  </PageTransitionFade>
{:else}
  <section class="layout col">
    <img
      alt="google dino"
      width="64"
      style="mix-blend-mode:darken"
      src="$lib/assets/dino.png" />
    <h2>No items in timeline. Click 'Add' to create a new event.</h2>
  </section>
{/if}

<style>
  .layout {
    min-height: 80vh;
    width: 100%;
    display: flex;
    justify-content: center;
    margin-left: calc(var(--timeline-width) / 2);
    align-items: center;
    transition: margin-left 0.5s ease;
  }

  @media (max-width: 1000px) {
    .layout {
      margin-bottom: 10rem;
    }
  }
</style>
