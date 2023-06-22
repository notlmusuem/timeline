<script lang="ts">
  import Modal from "$lib/components/Modal.svelte";

  export let visible;
</script>


<Modal bind:visible={visible}>
  <h2 slot="header"><b>Timeline Quick Start Guide</b></h2>
  <p>
    Welcome! This guide provides an overview of key features to help you
    navigate and explore the timeline with ease.
  </p>
  <h3>
    Timeline <span class="material-symbols-rounded r rotate-90">commit</span>
  </h3>
  <ul>
    <li>
      Click on timeline items <span class="material-symbols-rounded i rotate-90"
        >commit</span> in the left column to view it.
    </li>
    <li>
      Click the <span class="material-symbols-rounded i">add</span> button or double-click
      to zoom in the timeline.
    </li>
    <li>
      Click the <span class="material-symbols-rounded i">remove</span> button to
      zoom out the timeline bar, and
      <span class="material-symbols-rounded i">refresh</span> to reset both zoom
      and position.
    </li>
    <li>
      Once zoomed in, click and drag or scroll on the timeline to move up or
      down.
    </li>
  </ul>
  <h3>Search Bar <span class="material-symbols-rounded r">search</span></h3>
  <ul>
    <li>
      Click on the search bar or hit <code>'/'</code> and type in a keyword or year
      to search for a timeline item.
    </li>
    <li>Click on the timeline item in the search results to navigate to it.</li>
    <li>
      Click on the <span class="material-symbols-rounded i">close</span> button to
      clear the search bar.
    </li>
  </ul>
  <h3>Navigation Buttons</h3>
  <ul>
    <li>
      <span class="material-symbols-rounded r">smartphone</span>
      <b> Mobile &mdash; </b>
      Swipe <span class="material-symbols-rounded i">swipe</span> left or right to
      navigate through timeline items.
    </li>
    <li>
      <span class="material-symbols-rounded r">mouse</span>
      <b> Mouse &mdash; </b>
      Click on the
      <span class="material-symbols-rounded i">keyboard_arrow_up</span>/<span
        class="material-symbols-rounded i">keyboard_arrow_down</span> floating buttons
      at the top and bottom of the screen to navigate up or down through timeline
      items.
    </li>
    <li>
      <span class="material-symbols-rounded r">keyboard_alt</span>
      <b> Keyboard &mdash;</b>
      Press<span class="material-symbols-rounded i">keyboard_arrow_up</span
      >/<span class="material-symbols-rounded i">keyboard_arrow_left</span>
      or
      <span class="material-symbols-rounded i">keyboard_arrow_down</span>/<span
        class="material-symbols-rounded i">keyboard_arrow_right</span> to navigate
      up or down through timeline items.
    </li>
  </ul>
  <h3>Fullscreen</h3>
  <ul>
    <li>
      Click on the image to view it in fullscreen mode. Click on the image again
      to exit fullscreen mode.
    </li>
    <li>
      On mobile, pinch <span class="material-symbols-rounded i">pinch</span> to zoom
      in and out of the image.
    </li>
  </ul>
  <h3>Accessibility</h3>
  <ul>
    <li>
      Press the
      <span class="material-symbols-rounded i">volume_up</span>
      button to hear a description of the current timeline item. Press the
      <span class="material-symbols-rounded i">stop</span> button to stop the audio
      playback.
    </li>
  </ul>
  <hr />
  <h3>Issues</h3>
  If you come across any issues or bugs, reach out to our team by visiting our&nbsp;<a
    href="https://github.com/SWE-2023/COSC-4P02-Project">
    GitHub repository</a
  >.
  <br />
  <br />
  <p slot="footer" style="text-align:center;">
    Click on the <span class="material-symbols-rounded i">help</span> button to view
    this message again
  </p>
</Modal>


<style>
  li { margin-bottom: 0.25rem; }
  .i { color: var(--color-theme-1); }
  .r { vertical-align: -15%; }
  .rotate-90 { transform: rotate(90deg); }

  hr {
    border: none;
    width: 80%;
    border-top: 1px solid var(--color-text);
    opacity: 0.33;
  }
</style>
