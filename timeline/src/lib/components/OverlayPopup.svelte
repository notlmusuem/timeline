<script lang="ts" context="module">
  export type MountDir = "top"|"right"|"bottom"|"left";
</script>

<script lang="ts">
  export let mount_dir: MountDir;
</script>

<div class="zero {mount_dir}">
  <div class="overlay">
    <div class="deco-box"><slot/></div>

    <div class="arrow-box">
      {#if mount_dir == "top" || mount_dir == "bottom"}
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
  :root {
    --bg-opacity: 0.5;
  }

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
  }

  .deco-box {
    padding: 1.5rem;
    background-color: rgba(var(--color-bg-1), var(--bg-opacity));
    backdrop-filter: blur(1em);

    border: var(--border);
    box-shadow: 0 0 1em #100d2e33;
    border-radius: 1em;
  }

  .arrow {
    & polyline {
      stroke-width: 1;
      stroke: var(--border-color);
      // should be rgba(var(--color-bg-1), var(--bg-opacity)) but this isn't
      // widely supported
      fill: var(--color-bg-1);

      filter: drop-shadow(0 0 1em #100d2e33);

      // is missing backdrop-filter: blur(1em), but in practise it's not
      // significantly noticeable except on very contrasting backgrounds
    }
  }

  .arrow-box {
    position: relative;
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

  .arrow-box {
    .top &, .bottom & { height: 3em; width: 6em; }
    .left &, .right & { width: 3em; height: 6em; }

    .top & { top: -1px; }
    .left & { left: -1px; }
    .bottom & { bottom: -1px; transform: scaleY(-1); }
    .right & { right: -1px; transform: scaleX(-1); }
  }
</style>
