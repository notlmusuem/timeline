<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from '$app/navigation';
  import { tweened } from "svelte/motion";
  import { quintOut } from "svelte/easing";
  import { writable, type Readable, type Writable } from "svelte/store";
  import { withPrevious as writablePrev } from 'svelte-previous';

  import { direction, mode, year } from "$lib/stores/store";
  import { windowWidth } from "$lib/stores/window";
  import { userStore } from "$lib/authStore";

  import EditorModal from "$lib/components/EditorModal.svelte";
  import EventEdit from "$lib/components/EventEdit.svelte";
  import ItemComponents from "$lib/components/ItemComponents.svelte";
  import ItemTransition from "$lib/components/ItemTransition.svelte";
  import PageTransitionFade from "$lib/components/PageTransitionFade.svelte";
  import QuickStartModal from "$lib/components/QuickStartModal.svelte";
  import SearchBar from "$lib/components/searchbar/SearchBar.svelte";
  import TimelineBar from "$lib/components/TimelineBar.svelte";
  import PageMeta from "$lib/components/PageMeta.svelte";

  import { parseIntNull, sleep } from "$lib/utils";
  import { Entry, Timeline } from "$lib/models/timeline.js";


  export let data;
  let timelines = (data.timelines ?? []).map(Timeline.from_obj);
  let entries = (data.entries ?? []).map(e => Entry.from_obj(e, timelines));

  let timeline_id: number = parseIntNull($page.params.timeline) as number;
  let entry_id: number|null = $page.params.entry == null
    ? null : parseIntNull($page.params.entry) as number;

  // todo: make timeline_id and entry_id more cohesive wrt to timeline and entry

  let timeline: Timeline;
  {
    const found = timelines.find(tl => tl.id == timeline_id);
    if (found == undefined) {
      throw new Error(`Timeline ${timeline_id} is missing!`);
    }
    timeline = found;
  }


  let pageMeta: {
    titles: string[], site_name: string,
    description: string|null, image: string|null
  };


  let [selected_entry, prev_entry]: [Writable<Entry|null>, Readable<Entry|null>]
  = writablePrev(null);
  let editing_entry = Entry.new_default();

  // if we ever select a null entries try to switch to any other one if possible
  selected_entry.subscribe(() => {
    if ($selected_entry == null && entries.length > 0) {
      // if the previous entry is still in the timeline, then switch to it instead
      if ($prev_entry != null && entries.indexOf($prev_entry) != -1) {
        $selected_entry = $prev_entry;
      } else {
        // otherwise just fallback to the first
        $selected_entry = entries[0];
      }
    }
  });

  // trigger the year tween
  $: if ($selected_entry != null) {
    $year = $selected_entry.start_date.getUTCFullYear();
  }

  onMount(() => {
    selected_entry.subscribe(async entry => {
      // don't hook navigation to other routes
      if (!$page.route.id?.startsWith("/timeline/")) { return; }

      // don't bother changing the url if it is already correct; otherwise it'll
      // break the back button!
      if (
        parseIntNull($page.params.timeline) == timeline.id
        && parseIntNull($page.params.entry) == $selected_entry?.id
      ) { return; }

      await goto(`/timeline/${timeline.id}/${entry?.id ?? ""}`, {
        replaceState: false,
        keepFocus: true,
        invalidateAll: false
      });

      // the browser history is sensitive to the document title, so we should
      // set it *after* goto so it displays properly in browser history
      pageMeta.titles = ($selected_entry != null ? [$selected_entry.title] : [])
        .concat(`${timeline.name} Timeline`);
      pageMeta.description = $selected_entry?.body ?? null;
      pageMeta.image = $selected_entry?.image ?? null;
    });
  });

  // update the fade direction when the entry gets changed
  selected_entry.subscribe(entry => {
    if ($prev_entry == null || entry == null) { return; }

    const last_idx = entries.indexOf($prev_entry as Entry);
    if (last_idx == -1) {
      throw new Error(`Last entry ${$prev_entry?.id} was not in timeline!`);
    }

    const idx = entries.indexOf(entry as Entry);
    if (idx == -1) {
      throw new Error(`Current entry ${entry?.id} was not in timeline!`);
    }

    // $direction is the side of the screen the next entry fades in from!
    // only change the direction if it's incorrect; we use horizontal directions
    // for arrow keys and swipes, and those should remain as is!
    if (idx > last_idx && $direction != "left") {
      $direction = "up";
    } else if (idx <= last_idx && $direction != "right") {
      $direction = "down";
    }
  });

  // if the page url changed, then update the selected entry accordingly
  page.subscribe(() => {
    // don't hook navigation to other routes
    if (!$page.route.id?.startsWith("/timeline/")) { return; }

    const entry_param = parseIntNull($page.params.entry);

    // if the url parameter is the same as the currently selected entry then we
    // don't need to do anything
    if (entry_param == $selected_entry) { return null; }

    if (entry_param == null) {
      $selected_entry = null;
    } else {
      $selected_entry = entries.find(e => e.id == entry_param) ?? null;
    }
  });

  // ...and do that once the first time on page load to initialize everything
  {
    const entry_param = parseIntNull($page.params.entry);
    if (entry_param == null) {
      $selected_entry = null;
    } else {
      $selected_entry = entries.find(e => e.id == entry_param) ?? null;
    }

    pageMeta = {
      titles: ($selected_entry != null ? [$selected_entry.title] : [])
        .concat(`${timeline.name} Timeline`),
      site_name: "NOTL Musuem",
      description: $selected_entry?.body ?? null,
      image: $selected_entry?.image ?? null,
    };
  }


  let startSelected: boolean;
  let endSelected: boolean;
  // don't display buttons if there is no entry select or we're at the boundary
  $: startSelected = $selected_entry == null
    ? true : entries.indexOf($selected_entry) == 0;
  $: endSelected = $selected_entry == null
    ? true : entries.indexOf($selected_entry) == entries.length - 1;

  function page_prev() {
    if (selected_entry == null) { return; }
    const idx = entries.indexOf($selected_entry as Entry);
    if (idx == -1) {
      throw new Error(`Entry ${$selected_entry?.id} is not in timeline for page_prev!`)
    }

    $selected_entry = entries[Math.max(0, idx - 1)];
  }

  function page_next() {
    if (selected_entry == null) { return; }
    const idx = entries.indexOf($selected_entry as Entry);
    if (idx == -1) {
      throw new Error(`Entry ${$selected_entry?.id} is not in timeline for page_next!`)
    }

    $selected_entry = entries[Math.min(entries.length - 1, idx + 1)];
  }


  // checks for multiple events in a year when dot on timeline is clicked
  async function multipleEventsCheck() {
    if (selected_entry == null) { return; }
    const idx = entries.indexOf($selected_entry as Entry);
    // const indexDate = timeline[currentIndex].start_date.getUTCFullYear();
    // for(var i=0; timeline.length; i++)
    // {
    //   if(timeline[i].start_date.getUTCFullYear() == indexDate)
    //   {
    //     currentIndex = i;
    //     break;
    //   }
    // }
  }


  let search_selection: Entry|null;
  $: if (search_selection != null) {
    $selected_entry = search_selection;
  }


  function handleCreate({ detail: new_entry }) {
    // entries.push(new_entry);
    // entries.sort((l, r) => l.start_date.getTime() - r.start_date.getTime())

    // currentIndex = entries.findIndex(entry => entry.id == new_entry.id);
    // selectedItem = entries[currentIndex];
    // currentItemIndexStore.set(currentIndex);
    // update();
    // mode.set("add");
    // mode.set("default");
  }

  function handleUpdate({ detail: new_entry }) {
    // console.log("updated entry", new_entry)
    // let idx = entries.findIndex(entry => entry.id == new_entry.id);
    // if (idx != -1) {
    //   entries[idx] = new_entry;
    // }

    // entries.sort((l, r) => l.start_date.getTime() - r.start_date.getTime())
    // idx = entries.findIndex(entry => entry.id == new_entry.id);

    // currentIndex = idx;
    // selectedItem = entries[currentIndex];
    // currentItemIndexStore.set(currentIndex);
    // update();
    // mode.set("add");
    // mode.set("default");
  }

  function handleDelete({ detail: rm_entry }) {
    // let idx = entries.findIndex(entry => entry.id == rm_entry.id);
    // if (idx != -1) {
    //   entries.splice(idx, 1);
    // }

    // selectedItem = entries[currentIndex--];
    // currentItemIndexStore.set(currentIndex);

    // if (entries.length >= 1) {
    //   update();
    //   mode.set("add");
    //   mode.set("default");
    // }
  }

  // todo: live reload the entries array **and the timelines array** when changes
  // are made to either table. consider calling handleCreate/Update/Delete instead
  // onMount(() => {
  //   const timelineChannel = supabase
  //     .channel("custom-all-channel")
  //     .on(
  //       "postgres_changes",
  //       { event: "*", schema: "public", table: "timeline" },
  //       () => {
  //         entries = await Entry.select_all(supabase);
  //       }
  //     ).subscribe();
  // });


  let touchStartX = 0;
  let touchEndX = 0;
  let touchDeltaX = 0;
  const opacity = tweened(1, {
    duration: 100,
    easing: quintOut,
  });

  const itemTranslateX = tweened(0, {
    duration: 300,
    easing: quintOut,
  });

  function handleTouchStart(event) {
    if (
      event.touches[0].clientX < 128 || event.touches[0].clientY < 128
      || $mode !== "default"
    ) { return; }

    touchStartX = event.touches[0].clientX;
  }

  function handleTouchMove(event) {
    if (
      event.touches[0].clientX < 128 || event.touches[0].clientY < 128
      || $mode !== "default"
    ) { return; }

    touchEndX = event.touches[0].clientX;
    if (Math.abs(touchEndX - touchStartX) < 60) { return };
    touchDeltaX = touchEndX - touchStartX;
    itemTranslateX.set(touchDeltaX);
    $opacity = 1 - Math.abs(touchDeltaX) / 750;
  }

  async function handleTouchEnd() {
    if (Math.abs(touchDeltaX) > 60) {
      if (touchDeltaX > 100 && !startSelected) {
        $direction = "none";
        await page_prev();
        $opacity = 0;
        $itemTranslateX = -250;
      } else if (touchDeltaX < -100 && !endSelected) {
        $direction = "none";
        await page_next();
        $opacity = 0;
        $itemTranslateX = 250;
      }

      sleep(250).then(() => {
        // after the tween has definitely finished, reset everything
        touchDeltaX = 0;
        $opacity = 1;
        $itemTranslateX = 0;
      });
    }
  }


  let modal_quick_start = false;
  let modal_editor_guide = false;

  let first_visit = false;
  $: if (first_visit && $mode == "default") {
    modal_quick_start = true;
    first_visit = false;
    localStorage.setItem("firstVisit", "false");
  }

  let first_time_editor = false;
  $: if (first_time_editor && $mode != "default") {
    modal_editor_guide = true;
    first_time_editor = false;
    localStorage.setItem("firstTimeEditor", "false");
  }

  onMount(() => {
    first_visit = localStorage.getItem("firstVisit") == null;
    first_time_editor = localStorage.getItem("firstTimeEditor") == null;
  });
</script>


<svelte:head>
  <!-- page metadata needs to be carefully updated in sync with navigation -->
  <PageMeta {...pageMeta} />
</svelte:head>

<svelte:window
  on:touchend|passive={handleTouchEnd}
  on:touchmove|passive={handleTouchMove} />

<QuickStartModal bind:visible={modal_quick_start} />

<EditorModal bind:visible={modal_editor_guide} />

<SearchBar bind:selection={search_selection} data={entries} />


<EventEdit
  entry={editing_entry}
  on:entryCreate={handleCreate}
  on:entryUpdate={handleUpdate}
  on:entryDeleted={handleDelete} />

{#if entries.length > 0 && $selected_entry != null}
  <TimelineBar
    timeData={entries}
    bind:modalQuickStart={modal_quick_start}
    bind:modalEditorGuide={modal_editor_guide}
    bind:currentEntry={$selected_entry}
    bind:startSelected={startSelected}
    bind:endSelected={endSelected}
    on:change={multipleEventsCheck}
    on:pagedown={page_next}
    on:pageup={page_prev} />
{/if}

{#if (entries.length > 0 || $mode != "default") && $selected_entry != null }
  <PageTransitionFade>
    {#key `${$selected_entry?.id}-${$direction}`}
      <section
        class="layout"
        style:transform-origin="bottom center"
        style:transform="translateX({$itemTranslateX}px)
          rotate({$itemTranslateX / ($windowWidth / 5)}deg)"
        style:opacity={$opacity}
        on:touchstart|passive={handleTouchStart}>

        <ItemTransition>
          <ItemComponents
            bind:editingItem={editing_entry}
            entry={$selected_entry} />
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
    {#if $userStore?.email != null}
      <h2>No items in this timeline. Click
        <span class="material-symbols-rounded i">add</span> to create the first
        event.</h2>
      {:else}
      <h2>No items in this timeline.</h2>
    {/if}
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
