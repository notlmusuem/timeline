<script lang="ts">
  import Modal from "$lib/components/Modal.svelte";

  export let visible;
</script>


<Modal bind:visible={visible}>
  <h2 slot="header"><b>Timeline Editing Guide</b></h2>
  <p>
    Welcome! This guide introduces and explains the timeline editing interface.
  </p>

  <h3>
    Opening the Editor
    <span class="material-symbols-rounded r rotate-90">commit</span>
  </h3>
  <ul>
    <li>
      Select a timeline event
      <span class="material-symbols-rounded i rotate-90">commit</span>
      in the left column and click the
      <span class="material-symbols-rounded i">edit</span>
      button to edit or remove the event.
    </li>
    <li>
      Or, click the <span class="material-symbols-rounded i">add</span> button to create a new event on this timeline.
    </li>
  </ul>

  <h3>Editing Events <span class="material-symbols-rounded r">edit</span></h3>
  <ul>
    <li>To edit an event, change or add any fields, and click the <span class="material-symbols-rounded i">edit</span> button to save changes.</li>
    <li>To delete an event, click the <span class="material-symbols-rounded i">delete</span> button.</li>
    <li>Events have certain <i>fields</i> they contain, which are all detailed below. Some of these fields are required and they will be marked with <span style="color:var(--color-theme-1)">*</span></li>
  </ul>

  <h3>Fields <span class="material-symbols-rounded r">tune</span></h3>
  <ul>
    <li>
      <span class="material-symbols-rounded r">title</span>
      <b> Title <span style="color:var(--color-theme-1)">*</span> &mdash; </b>
      <span>The title of the event that uniquely describes the event, and shows
        up in search results.</span>
    </li>

    <li>
      <span class="material-symbols-rounded r">date_range</span>
      <b> Start Date <span style="color:var(--color-theme-1)">*</span> &mdash; </b>
      <span>The day that the event started on. If the exact date is unknown, or
        if the event started on a month, year, or decade, enter any day of the
        month/year/decade the event occured in and set “Date Precision” field
        accordingly.</span>
    </li>
    <li>
      <span class="material-symbols-rounded r">date_range</span>
      <b> End Date &mdash; </b>
      <span>If the event lasted for multiple days, set this field to the day the
         event ended on or last occured. Similarly, if the exact date is
         unknown, or if it ended on a month, year, or decade, enter any day of
         the month/year/decade the event occured in and set “Date Precision”
         field accordingly.</span>
    </li>
    <li>
      <span class="material-symbols-rounded r">date_range</span>
      <b> Date Precision &mdash; </b>
      <span>This sets how precise the provided dates are and affects how the
        dates are presented. For instance if an event started sometime during
        1687 and ended sometime during 1688, but the dates/months are unknown,
        the start date would be <i>1687-01-01</i>, the end date would be
        <i>1688-01-01</i>, and the date precision would be set to year. The
        event would then display the date as <i>1687 – 1688</i>.</span>
    </li>

    <li>
      <span class="material-symbols-rounded r">article</span>
      <b> Description &mdash; </b>
      <span>The description text of the item that appears directly below the
        title and date.</span>
    </li>

    <li>
      <span class="material-symbols-rounded r">add_photo_alternate</span>
      <b> Images &mdash; </b>
      <span>To upload images, click on the upload image button, or drag and drop
        an image onto the upload image button.</span>
    </li>

    <li>
      <span class="material-symbols-rounded r">photo</span>
      <b> Image URL &mdash; </b>
      <span>The link to the uploaded image. It is strongly suggested that you do
        not change this.</span>
    </li>

    <li>
      <span class="material-symbols-rounded r">link</span>
      <b> Image Source &mdash; </b>
      <span>This is a link to a page where users can view additional information
        about the image.</span>
    </li>

    <li>
      <span class="material-symbols-rounded r">notes</span>
      <b> Image Caption &mdash; </b>
      <span>The title of the event that uniquely describes the event, and shows
        up in search results.</span>
    </li>
  </ul>
  <p slot="footer" style="text-align:center;">
    Click on the <span class="material-symbols-rounded i">unknown_document</span> button to view
    this message again
  </p>
</Modal>
