<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  export let color = "var(--color-text)";

  const dispatch = createEventDispatcher();
</script>


<button class="item"
  on:click={() => { dispatch("selection"); }}
  transition:slide={{ duration: 250, easing: quintOut }}>
  <p style="color: {color}" class="text"><slot/></p>
</button>


<style>
  .item {
    display: flex;
    width: 100%;
    align-items: center;
    background: var(--color-bg-1);
    border: none;
    border-top: 1px solid var(--color-bg-2);
    transition: border 0.05s ease-in-out;
  }

  .item:hover {
    background: var(--color-text-card);
  }

  .item p {
    margin: var(--font-size-xsmall);
    text-align: left;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>
