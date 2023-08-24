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
  import PageMeta from "$lib/components/PageMeta.svelte";
  import PageTransitionFade from "$lib/components/PageTransitionFade.svelte";
  import QrModal from "$lib/components/QrModal.svelte";
  import QuickStartModal from "$lib/components/QuickStartModal.svelte";
  import SearchBar from "$lib/components/searchbar/SearchBar.svelte";
  import TimelineBar from "$lib/components/TimelineBar.svelte";

  import { parseIntNull, sleep } from "$lib/utils";
  import { Entry, Timeline } from "$lib/models/timeline.js";
  import EntryTimelineTransfer from "$lib/components/EntryTimelineTransfer.svelte";


  export let data;
  let timelines = (data.timelines ?? []).map(Timeline.from_obj);
  let entries = (data.entries ?? []).map(e => Entry.from_obj(e, timelines));

  let newEntries: Writable<Entry[]> = writable(entries);

  newEntries.subscribe(updated => {
    let yearEntries: Entry[][] = [];
    yearEntries = populateYearEntries(updated);
    sortingEntries(yearEntries);
    return populateNewEntries(yearEntries);
  });

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
  // assigns editing_entry with the current timeline id
  editing_entry.timeline.id = timeline.id;

  // if we ever select a null entries try to switch to any other one if possible
  selected_entry.subscribe(() => {
    if ($selected_entry == null) {
      // if the previous entry is still in the timeline, then switch to it instead
      if ($prev_entry != null && $newEntries.indexOf($prev_entry) != -1) {
        $selected_entry = $prev_entry;
      } else if ($newEntries.length > 0) {
        // otherwise just fallback to the first if it exists
        $selected_entry = $newEntries[0];
      }
      // else: screw it just keep it null
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

      // hack: if navigating between timelines, just reload the page for now
      // this is an awful solution and will be fixed by #38 in the future
      if (parseIntNull($page.params.timeline) != timeline.id) {
        location.reload();
      }

      // don't bother changing the url if it is already correct; otherwise it'll
      // break the back button!
      if (
        parseIntNull($page.params.timeline) != timeline.id
        || parseIntNull($page.params.entry) == $selected_entry?.id
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

    const last_idx = $newEntries.indexOf($prev_entry as Entry);
    if (last_idx == -1) {
      throw new Error(`Last entry ${$prev_entry?.id} was not in timeline!`);
    }

    const idx = $newEntries.indexOf(entry as Entry);
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
      $selected_entry = $newEntries.find(e => e.id == entry_param) ?? null;
    }
  });

  // ...and do that once the first time on page load to initialize everything
  {
    const entry_param = parseIntNull($page.params.entry);
    if (entry_param == null) {
      $selected_entry = null;
    } else {
      $selected_entry = $newEntries.find(e => e.id == entry_param) ?? null;
    }

    pageMeta = {
      titles: ($selected_entry != null ? [$selected_entry.title] : [])
        .concat(`${timeline.name} Timeline`),
      site_name: "NOTL Musuem",
      description: $selected_entry?.body ?? null,
      image: $selected_entry?.image ?? null,
    };
  }

  let disableButton: boolean;

  let startSelected: boolean;
  let endSelected: boolean;
  let startMonthSelected: boolean;
  let endMonthSelected: boolean;
  // don't display buttons if there is no entry select or we're at the boundary
  $: startSelected = $selected_entry == null
    ? true : $newEntries.indexOf($selected_entry) == 0;
  $: endSelected = $selected_entry == null
    ? true : $newEntries.indexOf($selected_entry) == $newEntries.length - 1;

  $: startMonthSelected = $selected_entry == null
    ? true : prevMonthBtnFalse();
  $: endMonthSelected = $selected_entry == null
    ? true : nextMonthBtnFalse();

  $: disableButton = $userStore?.email == null;

  function page_prev() {
    if (selected_entry == null) { return; }
    const idx = $newEntries.indexOf($selected_entry as Entry);
    if (idx == -1) {
      throw new Error(`Entry ${$selected_entry?.id} is not in timeline for page_prev!`)
    }

    $selected_entry = $newEntries[Math.max(0, idx - 1)];
  }

  function page_next() {
    if (selected_entry == null) { return; }
    const idx = $newEntries.indexOf($selected_entry as Entry);
    if (idx == -1) {
      throw new Error(`Entry ${$selected_entry?.id} is not in timeline for page_next!`)
    }

    $selected_entry = $newEntries[Math.min($newEntries.length - 1, idx + 1)];
  }

  function page_prev_Month() {
    if (selected_entry == null) { return; }
    const idx = $newEntries.indexOf($selected_entry as Entry);
    if (idx == -1) {
      throw new Error(`Entry ${$selected_entry?.id} is not in timeline for page_next!`)
    }

    if($selected_entry != null)
    {
      const sameDateEntries = selectSameDateEntries($selected_entry);
      const currentMonth = $selected_entry.start_date.getMonth();
      for(let i = 0; i < sameDateEntries.length; i++)
      {
        // find next entry of each element except for last element
        if(i < sameDateEntries.length - 1)
        {
          const nextMonth = nextMonthEntry(sameDateEntries, sameDateEntries[i]);

          // check if that entry = currentMonth entry
          if(nextMonth.start_date.getMonth() === currentMonth)
          {
            $selected_entry = sameDateEntries[i];
            break;
          }
        }
      }
    }
  }

  function nextMonthEntry(sameDateEntries, entry)
  {
    const currentMonth = entry.start_date.getMonth();
    for(let i = sameDateEntries.indexOf(entry); i < sameDateEntries.length; i++)
    {
      if(sameDateEntries[i].start_date.getMonth() > currentMonth)
      {
        return sameDateEntries[i];
      }
    }
    return null;
  }

  function page_next_Month() {
    if (selected_entry == null) { return; }
    const idx = $newEntries.indexOf($selected_entry as Entry);
    if (idx == -1) {
      throw new Error(`Entry ${$selected_entry?.id} is not in timeline for page_next!`)
    }

    if($selected_entry != null)
    {
      const sameDateEntries = selectSameDateEntries($selected_entry);
      const currentMonth = $selected_entry.start_date.getMonth();
      //console.log("current month is: " + currentMonth);
      for(let i = 0; i < sameDateEntries.length; i++)
      {
        // find the next month entry
        if(sameDateEntries[i].start_date.getMonth() >= currentMonth + 1)
        {
          $selected_entry = sameDateEntries[i];
          //console.log("Selected entry is: " + $selected_entry + " at index: " + i);
          break;
        }
      }
    }
  }

  function prevMonthBtnFalse()
  {
    const idx = $newEntries.indexOf($selected_entry as Entry);
    const sameDateEntries = selectSameDateEntries($selected_entry);

    if (selected_entry == null) { return true; }

    if (idx == -1)
    {
      throw new Error(`Entry ${$selected_entry?.id} is not in timeline for page_next!`)
    }

    if(sameDateEntries.length <= 1)
    {
      return true;
    }

    if($selected_entry != null)
    {
      if($selected_entry.start_date_precision === 'year')
      {
        return true;
      }
      // does selected entry have the same month as the last first entry?
      else if(sameDateEntries[0].start_date.getMonth() === $selected_entry.start_date.getMonth())
      {
        //console.log("selected entry is the first month entry");
        return true;
      }
    }

    return false;
  }

  function nextMonthBtnFalse()
  {
    const idx = $newEntries.indexOf($selected_entry as Entry);
    const sameDateEntries = selectSameDateEntries($selected_entry);

    if (selected_entry == null) { return true; }

    if (idx == -1)
    {
      throw new Error(`Entry ${$selected_entry?.id} is not in timeline for page_next!`)
    }

    if(sameDateEntries.length <= 1)
    {
      return true;
    }

    if($selected_entry != null)
    {
      // is selected entry a year entry?
      if($selected_entry.start_date_precision === 'year')
      {
        return true;
      }
      // does selected entry have the same month as the last month entry?
      else if(sameDateEntries[sameDateEntries.length - 1].start_date.getMonth() === $selected_entry.start_date.getMonth())
      {
        //console.log("selected entry is the last month entry");
        return true;
      }
    }

    return false;
  }

  function selectSameDateEntries(selectedEntry)
  {
    const sameYearEntries: Entry[] = [];
    const selectedYear = selectedEntry.start_date.getUTCFullYear();
    for(let i = 0; i < $newEntries.length; i++)
    {
      const year = $newEntries[i].start_date.getUTCFullYear();
      if(year === selectedYear && $newEntries[i].start_date_precision !== "year")
      {
        sameYearEntries.push($newEntries[i]);
      }
    }
    return sameYearEntries;
  }

  function populateYearEntries(entries: Entry[]): Entry[][]
  {
    // using an array here is potentially really bad for performance!
    // we are effectively creating an array with 2024 elements in it; most of
    // which won't be used! this should probably be object of arrays keyed by year

    // this is the same as yearEntries = [] ..?
    let yearEntries: Entry[][] = Array().fill(Array().fill(null));
    // Access and modify elements in the 2D array
    for(var i=0; i<entries.length; i++)
    {
      const year = entries[i].start_date.getUTCFullYear();
      if(yearEntries[year] === undefined)
      {
        yearEntries[year] = [];
      }
      yearEntries[year].push(entries[i]);
    }
    return yearEntries;
  }

  function populateNewEntries(yearEntries: Entry[][]): Entry[]
  {
    let newEntries: Entry[] = [];
    for(let i = 0; i < yearEntries.length; i++)
    {
      if (yearEntries[i] !== undefined)
      {
        for(let j = 0; j < yearEntries[i].length; j++)
        {
          newEntries.push(yearEntries[i][j]);
        }
      }
    }
    return newEntries;
  }

  /* sort multiple events */
  function sortingEntries(yearEntries: Entry[][])
  {
    // Access and modify elements in the 2D array
    Object.keys(yearEntries).forEach(yr =>
    {
      yearEntries[yr].sort((a, b) =>
      {
        const aMonth = a.start_date.getMonth() + 1;
        const bMonth = b.start_date.getMonth() + 1;

        const aIsYear = a.start_date_precision === "year";
        const aIsDay = a.start_date_precision === "day";

        const bIsYear = b.start_date_precision === "year";
        const bIsDay = b.start_date_precision === "day";

        // non-year entries before year entries
        if(!aIsYear && bIsYear)
        {
          return -1;
        }
        // year entries after non-year entries
        else if(aIsYear && !bIsYear)
        {
          return 1;
        }
        // both a and b are not year entries
        else if(!aIsYear && !bIsYear)
        {
          // January before February
          if (aMonth < bMonth)
          {
            return -1;
          }
          // February after January
          else if (aMonth > bMonth)
          {
            return 1;
          }
          // don't change order - same month
          else
          {
            // a before b
            if(aIsDay && !bIsDay)
            {
              return -1;
            }
            // b before a
            else if(!aIsDay && bIsDay)
            {
              return 1;
            }
            else if(!aIsDay && !bIsDay)
            {
              return 0;
            }
          }
        }
      })
    });
  }


  let search_selection: Entry|null;
  $: if (search_selection != null) {
    $selected_entry = search_selection;
  }


  function handleCreate({ detail: new_entry }) {
    $newEntries.push(new_entry);
    $newEntries = $newEntries;

    $selected_entry = new_entry;

    mode.set("default");
  }

  function handleUpdate({ detail: update_entry }) {
    console.log("updated entry", update_entry)
    let idx = $newEntries.findIndex(entry => entry.id == update_entry.id);
    if (idx == -1) {
      throw new Error(`Entry id ${update_entry.id} not found in entries to update!`);
    }

    $newEntries[idx] = Object.assign($newEntries[idx], update_entry);
    $newEntries = $newEntries;
    $selected_entry = $selected_entry;
  }

  function handleDelete({ detail: rm_entry }) {
    const idx = $newEntries.findIndex(entry => entry.id == rm_entry.id);
    if (idx == -1) {
      throw new Error(`Entry id ${rm_entry.id} not found in entries to remove!`);
    }

    $newEntries.splice(idx, 1);
    $newEntries = $newEntries;

    if ($selected_entry != null && $selected_entry.id == rm_entry.id) {
      if ($newEntries.length > 0) {
        $selected_entry = $newEntries[Math.max(idx - 1, 0)];
      } else {
        $selected_entry = null;
      }
    }
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


  let modal_qrcode = false;
  let modal_quick_start = false;
  let modal_editor_guide = false;
  export let entry_transfer = false;

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

<EntryTimelineTransfer
  entry={$selected_entry}
  bind:visible={entry_transfer} />

<EditorModal bind:visible={modal_editor_guide} />

<SearchBar bind:selection={search_selection} data={$newEntries} />

{#if $selected_entry != null}
  <QrModal bind:visible={modal_qrcode} entry={$selected_entry} />
{/if}

{#if $newEntries.length > 0 && $selected_entry != null}
  <TimelineBar
    bind:timeData={$newEntries}
    bind:modalQuickStart={modal_quick_start}
    bind:modalEditorGuide={modal_editor_guide}
    bind:currentEntry={$selected_entry}
    bind:startSelected={startSelected}
    bind:endSelected={endSelected}
    bind:startMonthSelected={startMonthSelected}
    bind:endMonthSelected={endMonthSelected}
    on:nextMonth={page_next_Month}
    on:prevMonth={page_prev_Month}
    on:pagedown={page_next}
    on:pageup={page_prev} />
{/if}

{#if ($newEntries.length > 0 || $mode != "default") && $selected_entry != null }
  <EventEdit
    entry={editing_entry}
    selectedEntry={$selected_entry}
    disableButton = {false}
    bind:entryTransfer={entry_transfer}
    on:entryCreate={handleCreate}
    on:entryUpdate={handleUpdate}
    on:entryDeleted={handleDelete}
    on:showQR={() => { modal_qrcode = true; }} />

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
  <PageTransitionFade>
    {#key `${$selected_entry?.id}-${$direction}`}
        <ItemTransition>
          <ItemComponents
            bind:editingItem={editing_entry}
            entry={$selected_entry} />
        </ItemTransition>
    {/key}
  </PageTransitionFade>

  <!-- <section class="layout col"> -->
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

    <EventEdit
      entry={editing_entry}
      selectedEntry={$selected_entry}
      disableButton = {true}
      bind:entryTransfer={entry_transfer}
      on:entryCreate={handleCreate}
      on:entryUpdate={handleUpdate}
      on:entryDeleted={handleDelete}
      on:showQR={() => { modal_qrcode = true; }} />
  <!-- </section> -->
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
