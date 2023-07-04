<script lang="ts">
  import { onMount } from "svelte";
  import { quintOut } from "svelte/easing";
  import { slide } from "svelte/transition";
  import { page } from "$app/stores";

  import { type User } from "@supabase/supabase-js";

  import { themeStore } from "$lib/stores/store";
  import { timelines } from "$lib/stores/data";
  import { scrollY, mobile } from "$lib/stores/window";
  import { userStore, logout } from "$lib/authStore";

  import ExpandButton from "$lib/components/ExpandButton.svelte";
  import AccessibilityMenu from "$lib/components/AccessibilityMenu.svelte";
  import { setFontSize } from "$lib/components/TextSizeSelector.svelte";


  let user: User | null;
  $: { user = $userStore; }

  let isAccessibilityOpen = false;
  let isMenuOpen = false;

  let shadow = 0;
  $: { shadow = $scrollY > 25 ? 1 : 0; }

  $: {
    // menu closed on mobile and open on desktop by default
    isMenuOpen = !$mobile;
  }

  function handleClickOutside(event) {
    if ($mobile) {
      if (
        isMenuOpen &&
        !event.target.closest(".menubutton") &&
        !event.target.closest(".menu")
      ) {
        isMenuOpen = false;
      }
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
          class="menu">
          <li aria-current={$page.url.pathname === "/" ? "page" : undefined}>
            <a
              title="Home"
              href="/"
              on:click={() => {
                if ($mobile) isMenuOpen = false;
              }}>Home</a>
          </li>
          {#each $timelines as timeline}
            <li aria-current={
              $page.url.pathname.startsWith(`/timeline/${timeline.id}`)
              ? "page" : undefined
            }>
              <a title={timeline.name} href={`/timeline/${timeline.id}`}
                on:click={() => { if ($mobile) { isMenuOpen = false; }}}
                >{timeline.name}</a>
            </li>
          {/each}
        </ul>
      {/if}
    </div>

    <div class="right">
      <button
        title="Accessibility options"
        class="material-symbols-rounded icon-btn accessibility"
        on:click={() => (isAccessibilityOpen = !isAccessibilityOpen)}
        on:keydown={(e) => {
          if (e.key === "Enter") {
            isAccessibilityOpen = !isAccessibilityOpen;
          }
        }}>settings</button>
      <AccessibilityMenu bind:open={isAccessibilityOpen} />

      {#if user && user.email}
        <button
          title="Logout"
          class="material-symbols-rounded icon-btn"
          on:click|preventDefault={() => { logout(); }}
          on:keypress|preventDefault={() => { logout(); }}
          >logout</button>
      {:else}
        <a href="/login"
          title="Login"
          class="material-symbols-rounded icon-btn"
          style="scale: 1.2;"
          >login</a>
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

  .right {
    display: flex;
    justify-content: flex-end;
    margin-right: 1em;
    gap: .75em;
  }

  .icon-btn {
    appearance: none;
    background: none;
    border: none;

    font-size: 1.8rem;
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
