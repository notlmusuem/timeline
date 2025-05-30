<script lang="ts" context="module">
  import { scale } from "svelte/transition";

  export type MountDir = "top"|"right"|"bottom"|"left";
</script>

<script lang="ts">
  export let direction: MountDir;
  export let offset: number = 0;
  export let fix_arrow: boolean = false;

  export let class_: string|undefined = undefined;
  const class_str = class_ ?? "";
  export let id: string|undefined = undefined;


  let overlayStyle: string, arrowStyle: string;
  $: {
    let offsetPercent = `${(offset - .5) * 100}%`
    let arrowPrecent = ((offset * (fix_arrow ? 1 : 0.6)) * 100) + "%";
    switch (direction) {
      case "top":
        overlayStyle = `transform: translate(${offsetPercent}, -100%);`;
        // account for the width of the arrow by adding half of it
        arrowStyle = `right: calc(${arrowPrecent} + 1.5em);`;
        break;
      case "left":
        overlayStyle = `transform: translate(-100%, ${offsetPercent});`;
        arrowStyle = `bottom: calc(${arrowPrecent} + 1.5em);`;
        break;
      case "bottom":
        overlayStyle = `transform: translate(${offsetPercent}, 0%);`;
        arrowStyle = `right: calc(${arrowPrecent} + 1.5em);`;
        break;
      case "right":
        overlayStyle = `transform: translate(0%, ${offsetPercent});`;
        arrowStyle = `bottom: calc(${arrowPrecent} + 1.5em);`;
        break;
    }
  }
</script>

<div class="zero {direction} {class_str}" {id}
  transition:scale={{ duration: 100 }}>
  <div class="overlay" style={overlayStyle}>
    <div class="deco-box"><slot/></div>

    <div class="arrow-box" style={arrowStyle}>
      {#if direction == "top" || direction == "bottom"}
        <svg class="arrow" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
          <polyline points="25, 0  50, 25  75, 0"/>
        </svg>
      {:else}
        <svg class="arrow" viewBox="0 0 50 100" xmlns="http://www.w3.org/2000/svg">
          <polyline points="0, 25  25, 50  0, 75"/>
        </svg>
      {/if}
    </div>
  </div>
</div>

<style lang="less">
  .zero {
    position: relative;
    width: 0;
    height: 0;
  }

  .overlay {
    position: absolute;
    width: auto;
    z-index: 10;

    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .deco-box {
    backdrop-filter: blur(1rem);

    background-color: var(--color-bg-1);
    // safari locks color-mix behind a flag; just don't do transparency in that case
    @supports (background-color: color-mix(in srgb, var(--color-bg-1) 75%, transparent)) {
      background-color: color-mix(in srgb, var(--color-bg-1) 75%, transparent);
    }

    border: var(--border);
    box-shadow: 0 0 1em #100d2e33;
    border-radius: 1em;
    pointer-events: initial;
  }

  .arrow {
    height: 3em; width: 6em;

    // since .arrow is sized larger than it's parent's box, stop clicks on it
    pointer-events: none;

    & polyline {
      stroke-width: 1;
      stroke: var(--border-color);
      fill: var(--color-bg-1);

      filter: drop-shadow(0 0 1em #100d2e33);

      // is missing backdrop-filter: blur(1em), but in practise it's not
      // significantly noticeable except on very contrasting backgrounds
      // a solution is to put a div behind it with clip-path and backdrop-filter
    }
  }

  .arrow-box {
    // for nudging the arrow such that it covers up .deco-box's border
    position: relative;
    // this box is offset from the actual svg for some reason, so ignore pointer
    // events in case the user clicks on the blank space it occupies
    // pointer-events: initial;

    // change box size while allowing .arrow's drop-shadow to bleed through
    height: 3em; width: 6em;
  }


  .zero {
    &.top { top: 0%; left: 50%; }
    &.left { left: 0%; top: 50%; }
    &.bottom { bottom: -100%; left: 50%; }
    &.right { right: -100%; top: 50%; }
  }

  .overlay {
    .top & { flex-direction: column; transform: translate(-50%, -100%); }
    .left & { flex-direction: row; transform: translate(-100%, -50%); }
    .bottom & { flex-direction: column-reverse; transform: translate(-50%, 0%); }
    .right & { flex-direction: row-reverse; transform: translate(0%, -50%); }
  }

  .arrow {
    .top &, .bottom & { height: 3em; width: 6em; }
    .left &, .right & { width: 3em; height: 6em; }
  }

  .arrow-box {
    .top &, .bottom & { height: 1.5em; width: 3em; }
    .left &, .right & { width: 1.5em; height: 3em; }

    .top & { top: -2px; }
    .left & { left: -2px; }
    .bottom & { bottom: -2px; transform: scaleY(-1); }
    .right & { right: -2px; transform: scaleX(-1); }
  }
</style>
