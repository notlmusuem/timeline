<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { slide, fly } from "svelte/transition";
  import { toast } from "@zerodevx/svelte-toast";
  import supabase from "$lib/supabaseClient";
  import type { PostgrestError } from "@supabase/supabase-js";

  import { userStore } from "$lib/authStore";
  import { direction, mode } from "$lib/stores/store";

  import { Entry } from "$lib/models/timeline";
  import OverlayPopup from "./OverlayPopup.svelte";

  export let entry: Entry;


  let user;
  userStore.subscribe(value => {
    user = value?.email ? value : null;
  });

  let moreShown: boolean = false;
  mode.subscribe(() => { moreShown = false; });

  const dispatch = createEventDispatcher();

  function startEdit() { mode.update(n => "edit"); }
  function startAdd() { mode.update(n => "add"); }
  function stopChange() { mode.update(n => "default"); }

  function isValidDateFormat(date) {
    // A date instance is invalid iff it's timestamp is nan
    // note: the Date constructor also checks if the months/days are valid, and
    // considers all the ugly edge cases (e.g. Feb 29th)
    return !isNaN(date.getTime());
  }

  async function saveChanges(insert) {
    let inserting = !entry.in_table;  // insert the item if it is locally created

    if ((entry.title ?? "").trim() == "") {
      toast.push("<b>Error</b><br>Entry title is required.");
      return;
    }

    if (entry.start_date == null) {
      toast.push("<b>Error</b><br>Start date is required.");
      return;
    }

    if (entry.start_date == null || !isValidDateFormat(entry.start_date)) {
      toast.push("<b>Error</b><br>Start date is an invalid date.");
      return;
    }

    if (entry.end_date != null && !isValidDateFormat(entry.end_date)) {
      toast.push("<b>Error</b><br>End date is an invalid date.");
      return;
    }

    try {
      if (inserting) {
        await entry.insert(supabase);  // note: this updates item.id
        dispatch("entryCreate", entry);
      } else {
        await entry.update(supabase);
        dispatch("entryUpdate", entry);
      }

      stopChange();

      if (inserting) {
        toast.push("<b>Success</b><br>New entry added. Refreshing items...");
      } else {
        toast.push("<b>Success</b><br>Changes saved. Refreshing items...");
      }
      // fixme: a page reload isn't necessary and hinders the editing experience; see #26
      location.reload();
    } catch (err) {
      let error = err as PostgrestError;
      toast.push(`<b>Database Error</b><br>${error.message}`);
    }
  };

  const deleteEntry = async () => {
    if (confirm(
      "Are you sure you want to delete this entry?\nPress OK to permanently delete this entry."
    ) == false) { return; }

    try {
      await entry.delete(supabase);
      dispatch("entryDeleted");

      stopChange();

      toast.push("<b>Success</b><br>Entry deleted successfully. Refreshing items...");
      // fixme: a page reload isn't necessary and hinders the editing experience; see #26
      location.reload();
    } catch (err) {
      let error = err as PostgrestError;
      toast.push(`<b>Database Error</b><br>${error.message}`);
    }
  };
</script>

{#if user && user.email}
  {#key $mode}
    <div class="container" transition:fly={{ y: 100 }}>
      {#if $mode !== "default"}
        <div class="notice">
          <h2>{$mode === "edit" ? "Editing item" : "Adding item"}</h2>
        </div>
      {/if}
      <div class="edit-items">
        {#if $mode === "edit"}
          <button on:click={stopChange} title="Cancel changes"
            ><span class="material-symbols-rounded i">close</span
            >Cancel</button>
          <div class="line" />
          <button class="options" title="Save changes"
            on:click={() => saveChanges(false)}
            ><span class="material-symbols-rounded i">save</span
            >Save</button>
          <div class="line" />
          <button class="options" on:click={deleteEntry} title="Delete entry"
            ><span class="material-symbols-rounded i">delete</span
            >Delete</button>
        {:else if $mode === "add"}
          <button on:click={stopChange} title="Cancel changes"
            ><span class="material-symbols-rounded i">close</span
            >Cancel</button>
          <div class="line" />
          <button class="options" title="Save changes"
            on:click={() => saveChanges(true)}
            ><span class="material-symbols-rounded i">save</span
            >Save</button>
        {:else}
          <button on:click={startEdit} title="Edit items"
            ><span class="material-symbols-rounded i">edit</span
            >Edit</button>
          <div class="line" />
          <button on:click={startAdd} title="Add new item"
            ><span class="material-symbols-rounded i">add</span
            >Add</button>
          <div class="line" />
          <button title="Generate QR code"
            on:click={() => { dispatch("showQR"); }}
            ><span class="material-symbols-rounded i">qr_code_2_add</span
            >QR Code</button>
        {/if}
        <div class="line" />
        <div style="flex-basis: 10rem">
          {#if moreShown}
            <OverlayPopup direction="top" offset={-0.0}>
              <div class="more-items">
                <button class="options" title="Transfer to a different timeline"
                  on:click={() => { moreShown = false; }}
                  ><span class="material-symbols-rounded i">category</span
                    >Transfer</button>
                <div class="hline" />
                <button class="options" title="Duplicate this item"
                  on:click={() => { moreShown = false; }}
                  ><span class="material-symbols-rounded i">content_copy</span
                    >Duplicate</button>
              </div>
            </OverlayPopup>
          {/if}
          <button title="More options"
            on:click={() => { moreShown = !moreShown; }}
            ><span class="material-symbols-rounded i">more_vert</span
            ></button>
        </div>
      </div>
    </div>
  {/key}
{/if}

<style>
  .container {
    position: fixed;
    display: flex;
    left: 0;
    bottom: 0;
    flex-flow: column;
    align-items: center;
    width: 100%;
    margin-left: calc(var(--timeline-width) / 2);
    z-index: 2;
  }

  .edit-items {
    user-select: none;

    border-radius: var(--font-size-small);
    height: calc(3 * var(--font-size-base));
    width: clamp(10rem, 80vw, 30rem);
    margin-bottom: 1rem;

    display: flex;
    flex-direction: row;

    background: var(--color-bg-1);
    border: var(--border);
    transition: all 0.5s var(--curve);
    box-shadow: 5px 5px 7px #00000020;
  }

  .more-items {
    user-select: none;

    border-radius: var(--font-size-small);
    background: var(--color-bg-1);
    border: var(--border);

    display: flex;
    flex-flow: column;

    align-items: center;
  }

  .more-items > button {
    flex-basis: calc(3 * var(--font-size-base));
    padding: 0 1rem;
  }

  .notice {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.25rem;
  }

  .notice h2 {
    color: var(--color-theme-1);
    font-family: var(--font-sans);
    font-size: var(--font-size-small);
    border: 1px dashed var(--color-theme-1);
    border-radius: var(--font-size-xsmall);
    background: var(--color-bg-1);
    opacity: 0.8;
    padding: 0.5rem 3rem;
    align-items: center;
    justify-content: center;
    margin: 0;
  }

  button {
    cursor: pointer;
    display: inline-flex;
    white-space: nowrap;
    flex-direction: row;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    font: var(--font-sans);
    color: var(--color-theme-1);
    background: none;
    width: 100%;
    height: 100%;
    border: none;
    transition: all 0.5s var(--curve);
  }

  .edit-items > *:first-child {
    border-radius: var(--font-size-small) 0 0 var(--font-size-small);
  }

  .edit-items > *:last-child {
    border-radius: 0 var(--font-size-small) var(--font-size-small) 0;
  }

  .line {
    display: flex;
    align-self: center;
    height: 66%;
    width: 1px;
    background-color: #00000020;
    transition: all 0.5s var(--curve);
  }

  .hline {
    display: flex;
    align-self: center;
    height: 1px;
    width: 66%;
    background-color: #00000020;
    transition: all 0.5s var(--curve);
  }

  button {
    font-size: var(--font-size-small);
  }

  button:hover {
    backdrop-filter: invert(0.1);
  }

  .edit-items:hover .line {
    background-color: transparent;
  }

  button:active {
    backdrop-filter: invert(0.2);
  }

  @media (max-width: 1000px) {
    button {
      font-size: var(--font-size-small);
    }

    .i {
      font-size: var(--font-size-base);
    }
  }
</style>
