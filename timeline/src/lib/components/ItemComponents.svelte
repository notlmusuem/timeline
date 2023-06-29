<script lang="ts">
  import { fade, slide } from "svelte/transition";
  import { writable } from "svelte/store";
  import { UTCDate } from "@date-fns/utc";
  import Fullscreen from "svelte-fullscreen";
  import { loadingAction } from "svelte-legos";
  import { toast } from "@zerodevx/svelte-toast";
  import supabase from "$lib/supabaseClient";
  import { format_date_numbers, structuredCloneProto } from "$lib/utils";

  import { mobile } from "$lib/stores/window";
  import { mode } from "$lib/stores/store";

  import Text2Speech from "$lib/components/TextToSpeech.svelte";

  import { Entry } from "$lib/models/timeline";


  let loading = true;
  let uploading = false;

  export let entry: Entry;
  export let editingItem: Entry = Entry.new_default();

  const full = writable(false);

  let startDateInput;
  let endDateInput;

  // dynamically reset editingItem when the edit/add buttons are pressed
  mode.subscribe(v => {
    if ($mode === "default") { return; }

    if ($mode === "edit") {
      // Since the changes to editingItem might be cancelled, we don't want to
      // modify the entry itself. Instead, clone it and edit the clone.
      editingItem = structuredCloneProto(entry);
    } else if ($mode === "add") {
      editingItem = Entry.new_default();
    }
  });


  async function upload(event) {
    uploading = true;
    const file = event.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.push(`<b>Error:</b><br>File size must be less than 4MB`);
        return;
      }

      const filename = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("images")
        .upload(filename, file);

      if (error != null) {
        if (error.message === "Duplicate") {
          toast.push(
            `<b>Error</b><br>${error.message}. Please try again in a few seconds.`
          );
        } else {
          toast.push(`<b>Error</b><br>${error.message}`);
        }
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("images")
        .getPublicUrl(filename);

      if ($mode !== "default") {
        editingItem.image = publicUrl;
      } else {
        toast.push(`<b>Error</b><br>Not currently editing an item; image was not uploaded`);
      }
    }
    uploading = false;
  }
</script>

{#key $mode}
  <section class="item-components">
    {#if entry.image || $mode !== "default"}
      <div class="media-component">
        {#if $mode !== "default"}
          <p class={uploading ? "upload-notice red" : "upload-notice"}>
            <span
              style="font-size:var(--font-size-small)"
              class={uploading
                ? "material-symbols-rounded i"
                : "material-symbols-rounded"}
              >{uploading ? "autorenew" : "cloud_upload"}</span
            >{uploading ? "Uploading..." : "Upload image"}
          </p>
        {/if}
        <div class="image-cont">
          {#if $mode !== "default"}
            <div class="edit-cont">
              <input
                type="file"
                class="image-edit upload"
                id="file_upload"
                on:change={upload} />
              <img
                class="image-edit"
                src={editingItem.image}
                alt={editingItem.title} />
              <div style="width:100%;text-align:center;">
                <p
                  style="font-size:var(--font-size-small);align-content:center">
                  <i>Paste image URL or drag and drop onto image section (4MB
                    limit).</i>
                </p>
              </div>

              <div class="input-cont">
                <label for="image_url">Image URL</label>
                <input
                  type="text"
                  name="image_url"
                  placeholder="https://example.com/image.jpg"
                  bind:value={editingItem.image}
                  on:change={event => {
                    editingItem.image = editingItem.image?.trim() ?? null;
                    if (editingItem.image == "") {
                      editingItem.image = null;
                    }
                  }} />
              </div>
              <div class="input-cont">
                <label for="image_credit">Image source</label>
                <input
                  type="text"
                  name="image_credit"
                  placeholder="https://example.com"
                  bind:value={editingItem.image_credit}
                  on:change={event => {
                    editingItem.image_credit = editingItem.image_credit?.trim() ?? null;
                    if (editingItem.image_credit == "") {
                      editingItem.image_credit = null;
                    }
                  }} />
              </div>
              <div class="input-cont">
                <label for="image_caption">Image caption</label>
                <input
                  type="text"
                  name="image_caption"
                  placeholder="Picture of a ..."
                  bind:value={editingItem.image_caption}
                  on:change={event => {
                    editingItem.image_caption = editingItem.image_caption?.trim() ?? null;
                    if (editingItem.image_caption == "") {
                      editingItem.image_caption = null;
                    }
                  }} />
              </div>
            </div>
          {:else if $mode == "default" && entry.image != null}
            {#if entry.image.includes("youtube.com")}
              <iframe
                class="video"
                title="youtube video"
                src={entry.image.replace("watch?v=", "embed/")}
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen />
            {:else}
              <div class="image-placeholder" use:loadingAction={loading}>
                <!-- svelte-ignore -->
                <Fullscreen let:onToggle let:onExit>
                  <img
                    on:load={() => (loading = false)}
                    class="image"
                    src={entry.image}
                    alt={entry.image_caption ?? entry.title}
                    on:keydown={event => {
                      if (event.key === "Escape") {
                        onExit();
                        $full = false;
                      }
                    }}
                    on:click={() => {
                      if (!$mobile) {
                        onToggle();
                        $full = !$full;
                      }
                    }} />
                </Fullscreen>
                <!-- {#if entry.image_caption != null}
                  <div class="image_caption">
                    <span>{entry.image_caption}</span>
                  </div>
                {/if} -->
              </div>
            {/if}
          {/if}
        </div>
      </div>
    {/if}

    <div class="text-component">
      {#if $mode !== "default"}
        <form>
          <div class='edit-cont'>
            <div class="input-cont">
              <label for="title"
                >Title <span style="color:var(--color-theme-1)">*</span></label>
              <input
                name="title"
                type="text"
                placeholder="Title"
                bind:value={editingItem.title}
                on:change={event => {
                  editingItem.title = editingItem.title?.trim() ?? null;
                }} />
            </div>
          </div>

          <div class="edit-cont">
            <div class="input-cont row-4">
              <label for="start_date"
                >Start Date <span style="color:var(--color-theme-1)">*</span></label>
              <input
                name="start_date"
                type="date"
                placeholder="YYYY-MM-DD"
                on:change={event => {
                  // We can't actually use typescript casts in this context
                  // because this isn't in a script lang="ts" block. Ew.
                  // @ts-ignore
                  const value = event.target?.value;

                  editingItem.start_date = new UTCDate(UTCDate.parse(value));
                }}
                value={format_date_numbers(editingItem.start_date, "day")}
                max={
                  editingItem.end_date == null
                    ? undefined
                    : format_date_numbers(editingItem.end_date, "day")
                } />
            </div>

            <div class="input-cont row-4">
              <!-- svelte-ignore a11y-invalid-attribute -->
              <label for="end_date"
                >End Date (<a href=""
                on:click|preventDefault={() => { endDateInput.value = null; }}
                on:keypress|preventDefault={() => { endDateInput.value = null; }}>remove end date</a>)</label>
              <input
                name="end_date"
                type="date"
                placeholder="YYYY-MM-DD"
                on:change={event => {
                  // @ts-ignore Not in a script lang="ts" block.
                  const value = event.target?.value;

                  editingItem.end_date = value == "" || value == null
                    ? null : new UTCDate(UTCDate.parse(value));

                  editingItem.end_date_precision = editingItem.end_date == null
                    ? null : editingItem.start_date_precision;
                }}
                value={
                  editingItem.end_date == null
                    ? undefined
                    : format_date_numbers(editingItem.end_date, "day")
                }
                bind:this={endDateInput}
                min={format_date_numbers(editingItem.start_date, "day")} />
            </div>

            <div class="input-cont row-4">
              <label for="date_precision"
                >Date Precision <span style="color:var(--color-theme-1)">*</span></label>
              <select
                name="date_precision"
                bind:value={editingItem.start_date_precision}
                on:change={event => {
                  // @ts-ignore Not in a script lang="ts" block.
                  const value = event.target?.value;
                  editingItem.end_date_precision =
                    editingItem.end_date == null ? null : value;
                }}>
                <option value="day">Exact Day</option>
                <option value="month">Month & Year</option>
                <option value="year">Year</option>
                <option value="decade">Decade</option>
              </select>
            </div>
          </div>

          <div class="input-cont">
            <label for="body">Description</label>
            <textarea
              name="body"
              placeholder="Description"
              bind:value={editingItem.body}
              on:change={event => {
                editingItem.body = editingItem.body?.trim() ?? null;
                if (editingItem.body == "") {
                  editingItem.body = null;
                }
              }}/>
          </div>
        </form>
      {:else}  <!-- $mode === "default" -->
        <h1 class="title">{entry.title}</h1>
        <p class="date"><i>{entry.format_date()}</i></p>
        <hr />
        {#if entry.body}
          <p class="desc">{entry.body}</p>
        {/if}
        <div class="cont-tts">
          <div class="tts">
            <!-- todo: put the image caption in here -->
            <Text2Speech texts={[entry.title, entry.format_date(), entry?.body]}/>
          </div>
          <div class="image_cred">
            {#if entry.image_credit != null}
              <a href="{entry.image_credit}" target="_blank" rel="noreferrer"
                >Image source</a>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  </section>
  <gap />
{/key}

<style>
  :root {
    --vid-ratio: 0.5625;
  }

  hr {
    margin-top: 2rem;
    width: 66%;
    height: 1px;
    border: none;
    opacity: 0.33;
    background-color: var(--color-text);
  }

  p {
    font-family: var(--font-sans);
    font-size: var(--font-size-base);
    padding: 1em 0 1em 0;
    margin: 0.5rem 0;
  }

  .image_caption {
    max-width: fit;
    width: 100%;
    padding: 1em;
    min-width: 40ch;
    display: flex;
    flex: 1 1 auto;
    align-items: center;
  }

  .image_caption > span {
    vertical-align: middle;
  }

  .cont-tts {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }

  .image_cred {
    display: flex;
    align-items: center;
    font-size: var(--font-size-xsmall);
  }

  .image_cred a {
    color: var(--color-text);
    opacity: 0.5;
    transition: all 0.3s var(--curve);
  }

  .image_cred a:hover {
    opacity: 1;
    color: var(--color-theme-1);
    text-decoration: none;
  }

  .item-components {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin-bottom: 3rem;
    gap: 1.5rem;
  }

  .text-component {
    flex: 1 2 50%;
    padding: 1rem 2rem;
    border-radius: 1.5rem;
    max-width: 60rem;
    border: var(--border);
    background: var(--color-text-card);
    filter: drop-shadow(5px 5px 7px 0 #00000020);
    text-align: justify;
  }

  .title {
    padding-top: 1rem;
    text-align: center;
  }

  .date {
    text-align: center;
    padding: 0;
    font-size: var(--font-size-medium);
    font-weight: 400;
  }

  .desc {
    text-align: justify;
    padding-top: 1rem;
  }

  .image-cont {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: var(--border);
    border-radius: 1.5rem;
    max-width: 100%;
    background: var(--color-text-card);
  }

  .image-placeholder {
    display: flex;
  }

  .image {
    z-index: 2;
    cursor: pointer;
    min-height: 60vh;
    max-height: 50vh;
    max-width: 100%;
    object-position: center center;
    object-fit: contain;
    border-radius: 1.5rem;
    box-shadow: 5px 5px 7px 0 #00000020;
  }

  @media (max-width: 1000px) {
    .text-component {
      padding: 1rem 1.5rem;
    }
    .title {
      font-size: var(--font-size-large);
    }
    .date {
      font-size: var(--font-size-base);
    }
    .desc {
      font-size: var(--font-size-small);
    }
    .image {
      min-height: 0vh;
      max-height: 40vh;
    }
  }

  .video {
    z-index: 2;
    max-width: 50vw;
    width: 60vw;
    height: calc(60vw * var(--vid-ratio));
    object-position: center center;
    object-fit: cover;
    border-radius: 1.5rem;
    box-shadow: 1rem 0rem 7px 0 #00000030;
  }

  /* ---------------------- EDIT ---------------------- */

  .edit-cont {
    display: flex;
    width: 100%;
    flex: 1 1 49%;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    max-width: 60rem;
  }

  .image-cont .edit-cont {
    margin: 1rem;
  }

  .input-cont {
    flex: 1 1 49%;
    display: flex;
    flex-flow: column wrap;
  }

  .input-cont.row-4 {
    flex: 1 1 calc(25% - 1rem);
  }

  label {
    font-size: 1em;
    padding-left: 1rem;
    color: var(--color-text);
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--color-text);
    opacity: 0.5;
  }

  input[type="text"],
  input[type="date"],
  select,
  textarea {
    text-overflow: ellipsis;
    flex: 1 1 auto;
    text-align: left;
    margin: 0.5em 0;
    padding: 0.9em;
    border-radius: var(--font-size-xsmall) var(--font-size-xsmall) 0 0;
    outline: none;
    border: none;
    background: transparent;
    backdrop-filter: invert(0.1) sepia(0.1) saturate(0.1) brightness(1.1)
      contrast(1.1);
    font-size: var(--font-size-small);
    color: var(--color-text);
    font-family: var(--font-sans);
    box-shadow: inset 0 -4px 0 -1px var(--color-theme-1);
    transition: all 0.3s var(--curve);
  }

  textarea {
    height: clamp(10rem, 20vh, 30rem);
    resize: none;
  }

  input:focus,
  textarea:focus {
    box-shadow: inset 0 -6px 0 -1px var(--color-theme-1);
  }

  .image-edit {
    position: relative;
    width: clamp(5rem, 70vw, 60rem);
    height: clamp(10rem, 30vw, 30rem);
    border: 3px solid var(--color-theme-1);
    z-index: 2;
    object-position: center center;
    object-fit: contain;
    border-radius: var(--font-size-medium);
    background: var(--color-bg-2);
  }

  .upload {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    margin: 0 auto;
    bottom: 0;
    opacity: 0;
    background: grey;
    z-index: 3;
  }

  .upload-notice {
    font-size: var(--font-size-small);
    margin-bottom: 0;
    padding-bottom: 0;
    justify-content: center;
    align-items: center;
    display: flex;
    gap: 0.5rem;
  }

  .i {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .red {
    font-weight: 700;
    color: var(--color-theme-1);
  }
</style>
