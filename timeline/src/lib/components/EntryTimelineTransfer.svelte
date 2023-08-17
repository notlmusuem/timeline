<script lang="ts">
  import Modal from "$lib/components/Modal.svelte";
  import Button from "$lib/components/Button.svelte";
  import { onMount } from "svelte";
  import { afterUpdate, onDestroy } from 'svelte';
  import { Entry } from "$lib/models/timeline.js";
  import { timelines } from "$lib/stores/data";
  import { toast } from "@zerodevx/svelte-toast";
  import supabase from "$lib/supabaseClient";
  import type { PostgrestError } from "@supabase/supabase-js";
  import { selectedTimelineStore } from "$lib/stores/store";

  export let visible: boolean;

  export let entry: Entry | null;
  let currentTimeline = entry?.timeline;
  let selected;

  function hideOverlay()
  {
    visible = false;
  }

  $: {
    if(visible)
    {
      selectedTimelineStore.subscribe(value => {
        //console.log("value in store: " + value);
        selected = value;
      });
    }
  }

  async function transferEntry()
  {
    if(entry != undefined && selected !== currentTimeline?.id)
    {
      entry.timeline = $timelines[selected - 1];
      try
      {
        await entry.update(supabase);
        hideOverlay();
        toast.push("<b>Success</b><br>Entry transferred. Refreshing items...");
        location.reload();
      } catch (err) {
        let error = err as PostgrestError;
        toast.push(`<b>Database Error</b><br>${error.message}`);
      }
    }
    else if (selected === currentTimeline?.id)
    {
      toast.push("<b>Error</b><br>Entry is already located in timeline '" + currentTimeline?.name + "'");
    }
  }
</script>

<div class="qr_modal">
  <Modal bind:visible>
    <h2 slot="header"><b>Transfer item</b></h2>

    <div class="hcenter">
      <div class="popup-content">
        <label>Timeline to Transfer to</label>
        <select bind:value={selected}>
          {#each $timelines as timeline}
            {#if timeline.in_table}
              <option value={timeline.id}
                disabled={entry?.timeline.id == timeline.id}>
                {timeline.name}
              </option>
            {/if}
          {/each}
        </select>
      </div>
    </div>

    <svelte:fragment slot="btns">
        <Button autofocus on:click={async () => { transferEntry() }}>
          <i class="material-symbols-rounded">check</i>Transfer
        </Button>
        <Button autofocus on:click={() => { hideOverlay() }}>
          <i class="material-symbols-rounded">close</i>Close
        </Button>
    </svelte:fragment>
  </Modal>
</div>


<style>
  .popup-content
  {
    padding: 20px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  }

  .qr_modal :global(.modal-container)
  {
    max-width: 20rem;
  }

  .hcenter
  {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25em;
  }
</style>
