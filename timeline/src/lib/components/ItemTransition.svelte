<script>
  import { fly, blur } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  import { direction, reduceMotionStore } from "$lib/stores/store";
  import { derived } from "svelte/store";

  let transition = fly;
  let offset = 200;

  $: {
    if ($reduceMotionStore) {
      transition = blur;
    }
  }

  const inTransition = derived(direction, ($direction) => ({
    duration: 250,
    delay: 251,
    x: $direction === "left" ? offset : $direction === "right" ? -offset : 0,
    y: $direction === "up" ? -offset : $direction === "down" ? offset : 0,
    easing: quintOut,
  }));

  const outTransition = derived(direction, ($direction) => ({
    duration: 250,
    x: $direction === "left" ? -offset : $direction === "right" ? offset : 0,
    y: $direction === "up" ? offset : $direction === "down" ? -offset : 0,
    easing: quintOut,
  }));
</script>

<div class="container">
  {#if $direction === "none"}
    <div>
      <slot />
    </div>
  {:else}
    <div in:transition={$inTransition} out:transition={$outTransition}>
      <slot />
    </div>
  {/if}
</div>

<style>
  .container {
    overflow: hidden;
    z-index: 1;
  }
</style>
