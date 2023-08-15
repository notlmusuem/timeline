<script lang="ts">
  import OverlayPopup from "./OverlayPopup.svelte";

  export let short: boolean = false;

  let popup: boolean = false;
</script>

<svelte:window on:click={() => { popup = false; }} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div>
  {#if short}
    <span>
      &copy; 2023, by the project contributors.
      Freely licensed under <a href="https://github.com/notlmusuem/timeline">MIT</a>.
      <br>Funded in part by ... and Brock University through the VPMI/FedDev Grant.
    </span>
  {:else}
    <span style='display: inline-block;'>&copy; 2023, by the</span>
    <span style='display: inline-block;' on:click|stopPropagation>
      {#if popup}
        <OverlayPopup direction="top" offset={0.15} fix_arrow>
          <div class="popup">
            <span class="nbr">Alec Ames</span>, <span class="nbr">Ibrahim Hashmi</span>, <span class="nbr">Francis Monwe</span>, <span class="nbr">Matthew Benson</span>, <span class="nbr">Tommy Pham</span>, <span class="nbr">Abhijeet Prajapati</span>, <span class="nbr">Justin Stickel</span>, <span class="nbr">Haaris Yahya</span>, <span class="nbr">Muhammed Bilal</span> and <span class="nbr">Michael Boulet</span>.
          </div>
        </OverlayPopup>
      {/if}
      <a on:click|preventDefault={() => { popup = !popup; }}>project contributors</a>.
    </span>
    <span>
      Freely licensed under <a href="https://github.com/notlmusuem/timeline">MIT</a>.
      Funded in part by ... and Brock University through the VPMI/FedDev Grant.
    </span>
  {/if}
</div>

<style>
  .nbr {
    word-break: keep-all;
    white-space: nowrap;
  }

  .popup {
    max-width: min(40em, 70vw);
    width: max-content;
    padding: 1rem;
    z-index: -99;
    font-size: var(--font-size-smallish)
  }
</style>
