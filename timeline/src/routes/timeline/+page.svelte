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
  import Modal from "$lib/components/Modal.svelte";

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

  function handleAdd() {
    selectedItem = timeline[0];
    update();
    $mode = "add";
  }

  function handleDelete() {
    if (timeline.length >= 1) {
      selectedItem = timeline[0];
      update();
      $mode = "default";
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

<Modal bind:visible={modalQuickStart}>
  <h2 slot="header"><b>Timeline Quick Start Guide</b></h2>
  <p>
    Welcome! This guide provides an overview of key features to help you
    navigate and explore the timeline with ease.
  </p>
  <h3>
    Timeline <span class="material-symbols-rounded r rotate-90">commit</span>
  </h3>
  <ul>
    <li>
      Click on timeline items <span class="material-symbols-rounded i rotate-90"
        >commit</span> in the left column to view it.
    </li>
    <li>
      Click the <span class="material-symbols-rounded i">add</span> button or double-click
      to zoom in the timeline.
    </li>
    <li>
      Click the <span class="material-symbols-rounded i">remove</span> button to
      zoom out the timeline bar, and
      <span class="material-symbols-rounded i">refresh</span> to reset both zoom
      and position.
    </li>
    <li>
      Once zoomed in, click and drag or scroll on the timeline to move up or
      down.
    </li>
  </ul>
  <h3>Search Bar <span class="material-symbols-rounded r">search</span></h3>
  <ul>
    <li>
      Click on the search bar or hit <code>'/'</code> and type in a keyword or year
      to search for a timeline item.
    </li>
    <li>Click on the timeline item in the search results to navigate to it.</li>
    <li>
      Click on the <span class="material-symbols-rounded i">close</span> button to
      clear the search bar.
    </li>
  </ul>
  <h3>Navigation Buttons</h3>
  <ul>
    <li>
      <span class="material-symbols-rounded r">smartphone</span>
      <b> Mobile &mdash; </b>
      Swipe <span class="material-symbols-rounded i">swipe</span> left or right to
      navigate through timeline items.
    </li>
    <li>
      <span class="material-symbols-rounded r">mouse</span>
      <b> Mouse &mdash; </b>
      Click on the
      <span class="material-symbols-rounded i">keyboard_arrow_up</span>/<span
        class="material-symbols-rounded i">keyboard_arrow_down</span> floating buttons
      at the top and bottom of the screen to navigate up or down through timeline
      items.
    </li>
    <li>
      <span class="material-symbols-rounded r">keyboard_alt</span>
      <b> Keyboard &mdash;</b>
      Press<span class="material-symbols-rounded i">keyboard_arrow_up</span
      >/<span class="material-symbols-rounded i">keyboard_arrow_left</span>
      or
      <span class="material-symbols-rounded i">keyboard_arrow_down</span>/<span
        class="material-symbols-rounded i">keyboard_arrow_right</span> to navigate
      up or down through timeline items.
    </li>
  </ul>
  <h3>Fullscreen</h3>
  <ul>
    <li>
      Click on the image to view it in fullscreen mode. Click on the image again
      to exit fullscreen mode.
    </li>
    <li>
      On mobile, pinch <span class="material-symbols-rounded i">pinch</span> to zoom
      in and out of the image.
    </li>
  </ul>
  <h3>Accessibility</h3>
  <ul>
    <li>
      Press the
      <span class="material-symbols-rounded i">volume_up</span>
      button to hear a description of the current timeline item. Press the
      <span class="material-symbols-rounded i">stop</span> button to stop the audio
      playback.
    </li>
  </ul>
  <hr />
  <h3>Issues</h3>
  If you come across any issues or bugs, reach out to our team by visiting our&nbsp;<a
    href="https://github.com/SWE-2023/COSC-4P02-Project">
    GitHub repository</a
  >.
  <br />
  <br />
  <p slot="footer" style="text-align:center;">
    Click on the <span class="material-symbols-rounded i">help</span> button to view
    this message again
  </p>
</Modal>

<Modal bind:visible={modalEditorGuide}>
  <h2 slot="header"><b>Timeline Editing Guide</b></h2>
  <p>
    Welcome! This guide introduces and explains the timeline editing interface.
  </p>

  <h3>
    Opening the Editor
    <span class="material-symbols-rounded r rotate-90">commit</span>
  </h3>
  <ul>
    <li>
      Select a timeline event
      <span class="material-symbols-rounded i rotate-90">commit</span>
      in the left column and click the
      <span class="material-symbols-rounded i">edit</span>
      button to edit or remove the event.
    </li>
    <li>
      Or, click the <span class="material-symbols-rounded i">add</span> button to create a new event on this timeline.
    </li>
  </ul>

  <h3>Editing Events <span class="material-symbols-rounded r">edit</span></h3>
  <ul>
    <li>To edit an event, change or add any fields, and click the <span class="material-symbols-rounded i">edit</span> button to save changes.</li>
    <li>To delete an event, click the <span class="material-symbols-rounded i">delete</span> button.</li>
    <li>Events have certain <i>fields</i> they contain, which are all detailed below. Some of these fields are required and they will be marked with <span style="color:var(--color-theme-1)">*</span></li>
  </ul>

  <h3>Fields <span class="material-symbols-rounded r">tune</span></h3>
  <ul>
    <li>
      <span class="material-symbols-rounded r">title</span>
      <b> Title <span style="color:var(--color-theme-1)">*</span> &mdash; </b>
      <span>The title of the event that uniquely describes the event, and shows
        up in search results.</span>
    </li>

    <li>
      <span class="material-symbols-rounded r">date_range</span>
      <b> Start Date <span style="color:var(--color-theme-1)">*</span> &mdash; </b>
      <span>The day that the event started on. If the exact date is unknown, or
        if the event started on a month, year, or decade, enter any day of the
        month/year/decade the event occured in and set “Date Precision” field
        accordingly.</span>
    </li>
    <li>
      <span class="material-symbols-rounded r">date_range</span>
      <b> End Date &mdash; </b>
      <span>If the event lasted for multiple days, set this field to the day the
         event ended on or last occured. Similarly, if the exact date is
         unknown, or if it ended on a month, year, or decade, enter any day of
         the month/year/decade the event occured in and set “Date Precision”
         field accordingly.</span>
    </li>
    <li>
      <span class="material-symbols-rounded r">date_range</span>
      <b> Date Precision &mdash; </b>
      <span>This sets how precise the provided dates are and affects how the
        dates are presented. For instance if an event started sometime during
        1687 and ended sometime during 1688, but the dates/months are unknown,
        the start date would be <i>1687-01-01</i>, the end date would be
        <i>1688-01-01</i>, and the date precision would be set to year. The
        event would then display the date as <i>1687 – 1688</i>.</span>
    </li>

    <li>
      <span class="material-symbols-rounded r">article</span>
      <b> Description &mdash; </b>
      <span>The description text of the item that appears directly below the
        title and date.</span>
    </li>

    <li>
      <span class="material-symbols-rounded r">add_photo_alternate</span>
      <b> Images &mdash; </b>
      <span>To upload images, click on the upload image button, or drag and drop
        an image onto the upload image button.</span>
    </li>

    <li>
      <span class="material-symbols-rounded r">photo</span>
      <b> Image URL &mdash; </b>
      <span>The link to the uploaded image. It is strongly suggested that you do
        not change this.</span>
    </li>

    <li>
      <span class="material-symbols-rounded r">link</span>
      <b> Image Source &mdash; </b>
      <span>This is a link to a page where users can view additional information
        about the image.</span>
    </li>

    <li>
      <span class="material-symbols-rounded r">notes</span>
      <b> Image Caption &mdash; </b>
      <span>The title of the event that uniquely describes the event, and shows
        up in search results.</span>
    </li>
  </ul>
  <p slot="footer" style="text-align:center;">
    Click on the <span class="material-symbols-rounded i">unknown_document</span> button to view
    this message again
  </p>
</Modal>

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
  on:saveNew={handleAdd}
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
      src="https://play-lh.googleusercontent.com/i-0HlK6I-K5ZVI28HFa4iXz0T22Mg2WjQ4gMsEYvqmSNdifp2NE41ZiaUCavmbIimQ" />
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

  li {
    margin-bottom: 0.25rem;
  }

  .i {
    color: var(--color-theme-1);
  }

  .r {
    vertical-align: -15%;
  }

  .rotate-90 {
    transform: rotate(90deg);
  }

  hr {
    border: none;
    width: 80%;
    border-top: 1px solid var(--color-text);
    opacity: 0.33;
  }
</style>
