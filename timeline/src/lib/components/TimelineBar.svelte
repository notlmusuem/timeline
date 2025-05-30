<script lang="ts">
  import { fly } from "svelte/transition";
  import { createEventDispatcher, onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut, quintOut } from "svelte/easing";

  import Cursor from "$lib/components/Cursor.svelte";
  import Dot from "$lib/components/Dot.svelte";
  import Arrow from "$lib/components/Arrow.svelte";

  import { userStore } from "$lib/authStore";
  import { direction, mode, year } from "$lib/stores/store";
  import { mobile, windowHeight } from "$lib/stores/window";

  import { Entry } from "$lib/models/timeline";


  export let timeData: Entry[];
  export let currentEntry;

  export let modalQuickStart: boolean;
  export let modalEditorGuide: boolean;

  export let startSelected: boolean;
  export let endSelected: boolean;

  let disabled: boolean;
  $: disabled = $mode !== "default";

  export let startMonthSelected: boolean;
  export let endMonthSelected: boolean;


  let dragging = false;
  let arrowVisible = true;

  let startY;
  let tweening;
  let zoom = 1;
  let zoomOffset = 0;
  let timelineHeight = 70;

  let lowest: number;
  let highest: number;
  let decadeGap: number;
  let decades: number[] = [];

  let firstYear: number = timeData[0].start_date.getUTCFullYear();
  $: firstYear = timeData[0].start_date.getUTCFullYear();

  let lastYear: number = timeData[timeData.length - 1].start_date.getUTCFullYear();
  $: lastYear = timeData[timeData.length - 1].start_date.getUTCFullYear();

  let dotEntryArray: Entry[] = [];
  $: {
    timeData;
    createNewDotArray();
  }

  const dispatch = createEventDispatcher();

  const callNextMonth = () => dispatch("nextMonth");

  const callPrevMonth = () => dispatch("prevMonth");

  const callPageDown = () => dispatch("pagedown");

  const callPageUp = () => dispatch("pageup");

  function change() {
    dispatch("change");
  }

  const setDetails = (item) => (currentEntry = item);

  $: zoomOffsetTweened = tweened(zoomOffset, {
    duration: 300,
    easing: cubicOut,
    interpolate: (a, b) => (t) => a + (b - a) * t,
  });

  $: getSpacing = (date) => {
    const top = lowest;
    const bottom = highest;
    const percentage = (date - top) / (bottom - top) - $zoomOffsetTweened;
    const spacing = percentage * (timelineHeight - 2) * $zoomTweened;
    return spacing;
  };

  $: $mobile ? (timelineHeight = 65) : (timelineHeight = 70);

  let zoomTweened = tweened(zoom, {
    duration: 300,
    easing: cubicOut,
  });

  function handleZoomIn() {
    const newZoom = $zoomTweened + 0.5;
    zoomTweened.set(newZoom);
    tweening = false;
    handleResize();
  }

  function handleZoomOut() {
    const newZoom = $zoomTweened - 0.5;
    if (newZoom < 1) {
      resetZoom();
      return;
    }
    zoomTweened.set(newZoom);
    tweening = false;
    setTimeout(() => {
      handleResize();
    }, 301);
  }

  function resetZoom() {
    zoomTweened.set(1);
    zoomOffsetTweened.set(0);
    tweening = true;
    setTimeout(() => {
      handleResize();
    }, 301);
  }

  function handleDragStart(e) {
    startY = e.touches ? e.touches[0].clientY : e.clientY;
    dragging = true;
  }

  function handleDragEnd() {
    dragging = false;
  }

  function handleDragMove(e) {
    if (!dragging) return;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = (startY - currentY) / (80 * $zoomTweened);
    const newZoomOffset = $zoomOffsetTweened + deltaY;
    if (newZoomOffset < 0 || newZoomOffset > 1 - 1 / $zoomTweened) return;
    zoomOffsetTweened.set(newZoomOffset);
    startY = currentY;
    tweening = false;
  }

  function handleWheel(e) {
    const newZoomOffset = $zoomOffsetTweened + e.deltaY / (500 * $zoomTweened);
    if (newZoomOffset < 0 || newZoomOffset > 1 - 1 / $zoomTweened) return;
    zoomOffsetTweened.set(newZoomOffset);
    tweening = false;
  }

  function handleResize() {
    let timelineHeightInPercentage = timelineHeight * 0.01 * $windowHeight;

    if ($zoomTweened < 1.5) decadeGap = 100 - timelineHeight;
    else if ($zoomTweened < 2.5) decadeGap = (100 - timelineHeight) / 2;
    else if ($zoomTweened < 4) decadeGap = 5;
    else if ($zoomTweened > 7) decadeGap = 1;

    const scale = Math.max(
      decadeGap,
      Math.min(
        timelineHeightInPercentage,
        Math.round((750 - $windowHeight) / 50) * 10
      )
    );
    lowest = Math.floor(firstYear / scale) * scale - 10;
    highest =
      Math.ceil(timeData[timeData.length - 1].start_date.getUTCFullYear() / scale) *
        scale +
      10;

    decades = [];
    for (let i = lowest; i <= highest; i += scale) {
      decades.push(i);
    }
  }

  function handleMove() {
    tweening = true;
  }

  // checks if the entry after has a different year
  function hasNextYearEntry(idx)
  {
    if(idx < timeData.length - 1)
    {
      if(timeData[idx].start_date.getUTCFullYear() == timeData[idx + 1].start_date.getUTCFullYear())
      {
        return false;
      }
      else
      {
        return true;
      }
    }
    else
    {
      return false;
    }
  }

  // creates an array for same date entries
  function selectSameDateEntries(selectedEntry)
  {
    const sameYearEntries: Entry[] = [];
    const selectedYear = selectedEntry.start_date.getUTCFullYear();
    for(let i = 0; i < timeData.length; i++)
    {
      const year = timeData[i].start_date.getUTCFullYear();
      if(year === selectedYear)
      {
        sameYearEntries.push(timeData[i]);
      }
    }
    return sameYearEntries;
  }

  // checks for multiple entries in a year when dot on timeline is clicked and creates a new array to traverse
  function createNewDotArray()
  {
    dotEntryArray = [];
    for(let i = 0; i < timeData.length; i++)
    {
      if(hasNextYearEntry(i) || i == timeData.length - 1)
      {
        const newArr = selectSameDateEntries(timeData[i]);
        dotEntryArray.push(newArr[0]);
      }
    }
  }

  onMount(() => {
    handleResize();
    year.set(firstYear);
  });

  handleResize();

  $: disabled ? (arrowVisible = false) : (arrowVisible = true);
</script>


<svelte:window on:resize={handleResize} on:mouseup={handleDragEnd} />

<div
  class={arrowVisible
    ? $userStore && $userStore.email
      ? "arrow-btns edit"
      : "arrow-btns"
    : "arrow-btns hidden"}>
  <div class="arrow-button" title="Previous month item">
    <Arrow
      on:moveup={() => {if (!startMonthSelected) { callPrevMonth(); }}}
      disabled={startMonthSelected} />
  </div>

  <div class="arrow-button" title="Next month item">
    <Arrow down
      on:movedown={() => {if (!endMonthSelected) { callNextMonth(); }}}
      disabled={endMonthSelected} />
  </div>

  <div class="arrow-button" title="Previous item">
    <Arrow
      on:moveup={() => {if (!startSelected) { callPageUp(); }}}
      disabled={startSelected} />
  </div>

  <div class="arrow-button" title="Next item">
    <Arrow down
      on:movedown={() => {if (!endSelected) { callPageDown(); }}}
      disabled={endSelected} />
  </div>

  <div class="help">
    <button
      class="help-btn"
      title="Show Quick Start guide"
      on:click={() => modalQuickStart = true}>
      <span class="material-symbols-rounded i">help</span>
    </button>
  </div>
</div>

<div
  class={"arrow-btns" + (!arrowVisible && $userStore?.email ? " edit" : " hidden")}>
  <div class="help">
    <button
      class="help-btn"
      title="Show Quick Start guide"
      on:click={() => modalEditorGuide = true}>
      <span class="material-symbols-rounded i">unknown_document</span>
    </button>
  </div>
</div>

<div
  style="--height:{timelineHeight}vh"
  transition:fly={{ x: -100, easing: quintOut, duration: 500 }}
  class={disabled ? "timeline-container disabled" : "timeline-container"}
  on:wheel|preventDefault={handleWheel}
  on:dblclick={handleZoomIn}
  on:mousedown={handleDragStart}
  on:mousemove={handleDragMove}
  on:mouseup={handleDragEnd}
  on:touchstart|passive={handleDragStart}
  on:touchmove|preventDefault={handleDragMove}
  on:touchend={handleDragEnd}>
  <div>
    <span class="line" />
    <div class="line-components">
      {#each dotEntryArray as td, i}
        <a
          class="lineItem"
          href='{`/timeline/${td.timeline.id}/${td.id}`}'
          on:click={handleMove}
          on:click={() => year.set(td.start_date.getUTCFullYear())}>
          <div
            class="dot"
            style="transform:translateY({
              getSpacing(td.start_date.getUTCFullYear())
            }vh)">
            <Dot
              on:click={() => {
                setDetails(td)
              }}
              year={td.start_date.getUTCFullYear()} />
          </div>
        </a>
      {/each}
      <Cursor pos={getSpacing($year)} {tweening} />
    </div>
    <ul class="timescale">
      {#each decades as decade, i}
        <li style="transform:translateY({getSpacing(decade)}vh)">
          {decade.toFixed(0)}
        </li>
      {/each}
    </ul>
  </div>
</div>
<div class={disabled ? "btns disabled" : "btns"} transition:fly={{ y: 100 }}>
  <button class="zoom-out" on:click={handleZoomOut} title="Zoom out"
    ><span class="material-symbols-rounded i">remove</span>
  </button>
  <button class="zoom-in" on:click={handleZoomIn} title="Zoom in"
    ><span class="material-symbols-rounded i">add</span>
  </button>
  <button class="reset" on:click={resetZoom} title="Reset zoom"
    ><span class="material-symbols-rounded i">refresh</span>
  </button>
</div>


<style>
  :root {
    --foot-height: 2px;
    --left: 20px;
    --anim: 0.33s cubic-bezier(0.13, 0.94, 0.16, 1.15);
    --timeline-width: 7rem;
  }

  div:focus {
    outline: none !important;
    border: none !important;
  }

  .line {
    border-radius: 25px;
    height: var(--height);
    position: fixed;
    width: 4px;
    left: var(--left);
    background-color: var(--color-theme-1);
    transition: left 0.5s var(--curve);
  }

  .line::after {
    content: "";
    position: absolute;
    top: 0;
    transform: translateX(-33%);
    width: 16px;
    height: var(--foot-height);
    border-radius: 10rem;
    background-color: var(--color-theme-1);
  }

  .line::before {
    content: "";
    position: absolute;
    bottom: 0;
    transform: translateX(-33%);
    width: 16px;
    height: var(--foot-height);
    border-radius: 10rem;
    background-color: var(--color-theme-1);
  }

  .line-components {
    user-select: none;
    position: relative;
    left: 0;
    transition: left 0.5s var(--curve);
  }

  .dot {
    position: relative;
    z-index: 1;
  }

  .dot:hover {
    z-index: 2;
  }

  .timescale {
    font-size: var(--font-size-small);
    user-select: none;
    z-index: -1;
    opacity: 0.66;
    list-style: none;
    margin: 0;
    height: var(--height);
    position: absolute;
    left: 3rem;
    padding: 0;
    transition: left 0.5s var(--curve);
  }

  .timescale li {
    position: absolute;
    padding: 0;
    margin: 0;
  }

  ::marker {
    content: "—   ";
    color: var(--color-bg-2);
  }

  li {
    opacity: 0.8;
    transition: color 0.5s var(--curve);
    cursor: default;
  }

  li:hover {
    opacity: 0.9;
  }

  .lineItem {
    user-select: none;
    display: flex;
    position: absolute;
  }

  .lineItem div {
    padding: none;
    position: relative;
  }

  .timeline-container {
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;
    position: fixed;
    width: var(--timeline-width);
    opacity: 1;
    z-index: 1;
    left: 0;
    overflow: hidden;
    -webkit-overflow: hidden;
    background: var(--color-bg-1);
    border: var(--border);
    border-left: 0;
    border-radius: 0 1rem 1rem 0;
    height: var(--height);
  }

  .timeline-container:active {
    cursor: grabbing;
  }

  .i {
    transition: transform 0.5s var(--curve);
  }

  .reset .i:hover {
    animation: rotate 1s forwards var(--curve);
  }

  .i:active,
  .i:focus {
    transform: scale(0.9);
  }

  .btns {
    display: flex;
    position: fixed;
    backdrop-filter: invert(0.1);
    bottom: 0;
    top: calc();
    left: 0;
    flex-flow: row wrap;
    width: var(--timeline-width);
    justify-content: space-evenly;
    margin: 0;
    z-index: 99;
    border-radius: 0 1rem 0 0;
    border: var(--border);
    border-left: none;
    gap: 2px;
  }

  button {
    cursor: pointer;
    background: transparent;
    backdrop-filter: invert(0.1);
    user-select: none;
    color: var(--color-theme-1);
    height: calc(var(--font-size-base) + 1rem);
    width: calc(var(--font-size-base) + 1rem);
    padding: 0rem;
    justify-self: center;
    border: none;
    transition: all 0.5s var(--curve);
  }

  button:hover {
    backdrop-filter: invert(0.2);
  }

  button:active {
    scale: 0.95;
    transition: none;
  }

  .help {
    z-index: 99;
    align-items: center;
    margin: 0.5rem;
    padding: 0;
  }

  .help button {
    cursor: pointer;
    background: none;
    width: calc(2.5 * var(--font-size-base));
    height: calc(2.5 * var(--font-size-base));
    backdrop-filter: invert(0.1);
    border-radius: 10rem;
    border: var(--border);
    transition: all 0.5s var(--curve);
  }

  .help button span {
    font-size: calc(1.5 * var(--font-size-base));
  }

  .arrow-btns {
    display: flex;
    position: fixed;
    bottom: 0;
    right: 0;
    flex-flow: column;
    margin: 0rem;
    gap: 0;
    z-index: 99;
    transition: all var(--anim);
  }

  .arrow-button {
    z-index: 4;
    transition: all var(--anim);
  }

  .arrow-btns.hidden {
    right: -5rem;
  }

  @media (max-width: 1000px) {
    .arrow-btns.edit {
      bottom: calc(4 * var(--font-size-base));
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 1000px) {
    :root {
      --left: 4px;
      --timeline-width: 4.75rem;
    }
    .line {
      left: var(--left);
    }
    .timescale {
      left: calc(5 * var(--left));
    }
    .line-components {
      left: calc((var(--left) - 20px));
    }
    .timeline-container {
      left: 0;
    }
    .btns {
      gap:0.5vh;
    }
  }

  @media screen and (max-height: 520px) {
    .btns {
      flex-flow: row wrap;
      width: 106px;
      gap: 0vh;
    }
  }

  .disabled {
    pointer-events: none;
  }

  .disabled::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    mix-blend-mode: screen;
    background: var(--color-bg-1);
    opacity: 0.8;
    z-index: 99;
  }
</style>
