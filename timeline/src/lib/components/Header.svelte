<script lang="ts">
  import { onMount } from "svelte";
  import { quintOut } from "svelte/easing";
  import { slide } from "svelte/transition";
  import { page } from "$app/stores";

  import { type User } from "@supabase/supabase-js";

  import { kioskMode, themeStore } from "$lib/stores/store";
  import { timelines } from "$lib/stores/data";
  import { scrollY, mobile, windowWidth } from "$lib/stores/window";
  import { userStore, logout } from "$lib/authStore";
  import { elem_ancestor_has_child } from "$lib/utils";

  import ExpandButton from "$lib/components/ExpandButton.svelte";
  import AccessibilityMenu from "$lib/components/AccessibilityMenu.svelte";
  import OverlayPopup from "$lib/components/OverlayPopup.svelte";
  import TimelineSetting from "$lib/components/TimelineSetting.svelte";
  import { setFontSize } from "$lib/components/TextSizeSelector.svelte";
  import UserSettingsPopup from "$lib/components/UserSettingsPopup.svelte";



  let user: User | null;
  $: { user = $userStore; }

  let isAccessibilityOpen = false;
  let isMenuOpen = false;
  let isTimelineSettingsOpen = false;
  let isUserSettingsOpen = false;

  let shadow = 0;
  $: { shadow = $scrollY > 25 ? 1 : 0; }

  $: {
    // menu closed on mobile and open on desktop by default
    isMenuOpen = !$mobile;
  }

  let timelineSettingCont: HTMLDivElement;
  let userSettingsCont: HTMLDivElement;
  function handleClickOutside(event) {
    if ($mobile) {
      if (
        isMenuOpen &&
        !event.target.closest(".menubutton") &&
        !event.target.closest(".menu")
      ) {
        isMenuOpen = false;
        event.preventDefault();
      }
    }

    // hide the menu when it's clicked outside of it
    // note: this condition only affects elements like the menu button which do
    // not get reflowed by svelte. The svelte tick happens just before this
    // event fires and so elem_ancestor_has_child will always fail for those
    // elements. For this reason, we have a onclick handler on the popup
    // container with stopPropagation.
    if (
      isTimelineSettingsOpen
      && !elem_ancestor_has_child(timelineSettingCont, event.target)
    ) {
      isTimelineSettingsOpen = false;
      event.preventDefault();
    }

    if (
      isUserSettingsOpen
      && !elem_ancestor_has_child(userSettingsCont, event.target)
    ) {
      isUserSettingsOpen = false;
      event.preventDefault();
    }
  }

  onMount(() => {
    setFontSize();
  });
</script>

<svelte:window on:click={handleClickOutside} />

<header>
  <nav class={shadow ? "shadow" : ""}>
    <div class="left">
      <a href="/">{#if $themeStore === "light-theme" || $themeStore === "reading-theme"}
        <img class="logo" src="$lib/assets/notl-museum.svg"
          alt="Niagara-on-the-Lake" />
      {:else}
        <img class="logo" src="$lib/assets/notl-museum-dark.svg"
          alt="Niagara-on-the-Lake" />
      {/if}</a>
      <div title="Toggle menu visibility" class="menubutton">
        <ExpandButton bind:open={isMenuOpen} />
      </div>
      {#if isMenuOpen}
        <ul
          transition:slide={{ axis: $mobile ? "y" : "x", easing: quintOut }}
          class="menu timeline-menu">
          {#each $timelines as timeline}
            {#if timeline.in_table}
              <li aria-current={
                $page.url.pathname.startsWith(`/timeline/${timeline.id}`)
                ? "page" : undefined
              }>
                <a title={timeline.name} href={`/timeline/${timeline.id}`}
                  on:click={() => { if ($mobile) { isMenuOpen = false; }}}
                  >{timeline.name}</a>
              </li>
            {/if}
          {/each}
        </ul>
      {/if}
    </div>

    <div class="right">
      {#if user && user.email}
        <div bind:this={timelineSettingCont}>
          {#if isTimelineSettingsOpen}
            <OverlayPopup direction="bottom" offset={$windowWidth >= 750 ? -.3 : $windowWidth >= 450 ? -.15 : -.1} fix_arrow
              class_="timeline_settings">
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div on:click={(event) => {
                // prevents clicks inside from getting handed by the window handler
                event.stopPropagation();
              }}>
                <TimelineSetting timelines={timelines} />
              </div>
            </OverlayPopup>
          {/if}
          <button
            title="Timeline Settings"
            class="material-symbols-rounded icon-btn timeline_settings_menu"
            on:click|preventDefault={() => {
              if (isAccessibilityOpen) { isAccessibilityOpen = false; }
              if (isUserSettingsOpen) { isUserSettingsOpen = false; }
              isTimelineSettingsOpen = !isTimelineSettingsOpen;
            }}
            on:keypress|preventDefault={() => {
              if (isAccessibilityOpen) { isAccessibilityOpen = false; }
              if (isUserSettingsOpen) { isUserSettingsOpen = false; }
              isTimelineSettingsOpen = !isTimelineSettingsOpen;
            }}
            >tune</button>
        </div>
      {/if}

      <button
        title="Accessibility options"
        class="material-symbols-rounded icon-btn accessibility"
        on:click={() => {
          if (isTimelineSettingsOpen) { isTimelineSettingsOpen = false; }
          isAccessibilityOpen = !isAccessibilityOpen;
        }}
        on:keydown={(e) => {
          if (e.key === "Enter") {
            if (isTimelineSettingsOpen) { isTimelineSettingsOpen = false; }
            if (isUserSettingsOpen) { isUserSettingsOpen = false; }
            isAccessibilityOpen = !isAccessibilityOpen;
          }
        }}>settings</button>
      <AccessibilityMenu bind:open={isAccessibilityOpen} />

      <a href="/about"
        title="About"
        class="material-symbols-rounded icon-btn"
        >info</a>

      {#if user && user.email}
        <div bind:this={userSettingsCont}>
          {#if isUserSettingsOpen}
            <OverlayPopup direction="bottom" offset={-.40} fix_arrow
              class_="timeline_settings">
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div on:click={(event) => {
                // prevents clicks inside from getting handed by the window handler
                event.stopPropagation();
              }}>
                <UserSettingsPopup on:close={() => { isUserSettingsOpen = false; }}/>
              </div>
            </OverlayPopup>
          {/if}
          <button
            title="Account Settings"
            class="material-symbols-rounded icon-btn timeline_settings_menu"
            on:click|preventDefault={() => {
              if (isAccessibilityOpen) { isAccessibilityOpen = false; }
              if (isTimelineSettingsOpen) { isTimelineSettingsOpen = false; }
              isUserSettingsOpen = !isUserSettingsOpen;
            }}
            on:keypress|preventDefault={() => {
              if (isAccessibilityOpen) { isAccessibilityOpen = false; }
              if (isTimelineSettingsOpen) { isTimelineSettingsOpen = false; }
              isUserSettingsOpen = !isUserSettingsOpen;
            }}
            >account_circle</button>
        </div>
      {:else}
        {#if !$kioskMode}
          <a href="/login"
            title="Login"
            class="material-symbols-rounded icon-btn"
            >login</a>
        {/if}
      {/if}
    </div>
  </nav>
</header>

<style>
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    background-color: var(--nav-color);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    top: 0;
    left: 0;
    width: 100%;
    height: 5rem;
    z-index: 1;
    transition: all 0.2s var(--curve);
  }

  nav.shadow {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  }

  ul {
    display: flex;
    align-items: baseline;
    flex-direction: row;
    gap: clamp(0rem, 1vw, 2rem);
    list-style: none;
    padding: 0;
    border: none;
    user-select: none !important;
  }

  li {
    white-space: nowrap;
  }

  li[aria-current="page"] a {
    color: var(--color-theme-1);
  }

  li::after {
    content: "";
    display: block;
    width: 100%;
    height: 3px;
    background: var(--color-theme-1);
    border-radius: 5px;
    transform: scale(0);
    transition: all 0.5s var(--curve);
  }

  li[aria-current="page"]::after {
    transform: scale(1);
  }

  li a,
  .i {
    font-size: var(--font-size-smallish);
  }

  li a {
    display: block;
    padding: 0.5em 0.2em;
    color: var(--color-text);
    text-decoration: none;
  }

  li:active {
    transform: scale(0.95);
  }

  li a:hover {
    color: var(--color-theme-1);
  }

  .logo {
    position: relative;
    margin: 0;
    width: auto;
    height: 3.5rem;
    border-radius: 0.5rem 0.5rem 0 0;
    user-select: none;
    transition: opacity 0.5s var(--curve), transform 0.2s var(--curve);
  }

  .logo:active {
    transform: scale(0.95);
  }

  .left {
    display: flex;
    align-items: center;
    margin-left: 0.75em;
  }

  .timeline-menu {
    overflow-y: scroll;
    /* todo: figure out the proper max width */
    max-width: 40vw;
  }

  .right {
    display: flex;
    justify-content: flex-end;
    margin-right: 1em;
    gap: 1em;
  }

  .icon-btn {
    appearance: none;
    background: none;
    border: none;
    padding: 0;

    font-size: var(--font-size-large);
    user-select: none;
    color: var(--color-theme-1);
  }

  .icon-btn:hover {
    cursor: pointer;
    text-decoration: unset;
  }

  .accessibility {
    transform: rotate(0);
    transition: transform 0.5s var(--curve);
  }

  .accessibility:hover {
    transform: rotate(180deg);
  }

  .accessibility:active {
    transition: transform 0.2s var(--curve);
    transform: rotate(180deg);
  }

  header {
    padding: 0.6em 0 0 0.6em;
    top: 0;
    left: 0;
    width: 100%;
    height: 5rem;
    z-index: 5;
  }

  @media (max-width: 900px) {
    ul {
      position: fixed;
      top: 5rem;
      left: 0;
      margin: 0;
      width: 100%;
      padding: 1rem 0;
      background-color: var(--color-bg-1);
      flex-direction: column;
      gap: 0.2rem;
      justify-content: center;
      align-items: center;
      overflow-y: auto;
      overflow-x: hidden;
      z-index: 9;
      box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.1);
      border-bottom: var(--border);
    }

    li {
      text-align: center;
    }
    li a {
      padding: 0.8rem 2rem;
      font-size: var(--font-size-base);
    }
  }
</style>
