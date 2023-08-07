<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { browser } from "$app/environment";
  import { sleep } from "$lib/utils";
  import { goto } from "$app/navigation";

  import { page } from "$app/stores";
  import { getSessionUser } from "$lib/authStore";
  import { kioskMode, resetStores, themeStore } from "$lib/stores/store";
  import {
    windowWidth, windowHeight, scrollY, scrollX, mobile,
  } from "$lib/stores/window";

  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import "./styles.css";
  import { base_url } from "$lib/stores/env";


  $: mobile.set($windowWidth < 1000);

  onMount(async () => {
    await getSessionUser();
  });

  if (!browser) {
    // handling promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Promise Rejection:', err);
    });
  } else {
    window.addEventListener('unhandledRejection', (err) => {
      console.error('Unhandled Promise Rejection:', err);
    });
  }


  const inactivity_duration = 10*60*1000;  // 10 minutes
  let current_reject: ((any) => void)|null = null;
  function inactivity(): Promise<void> {
    if (current_reject != null) { current_reject("User activity"); }

    return new Promise(async (resolve, reject) => {
      current_reject = reject;
      await sleep(inactivity_duration);
      if (current_reject == reject) { resolve(); }
    });
  }

  function reset_inactivity() {
    if (!$kioskMode) { return; }
    // call the promise and handle all rejections
    inactivity().then(handle_inactivity).catch(e => {});
  }

  async function handle_inactivity() {
    if (!$kioskMode) { return; }
    resetStores();
    $kioskMode = true;

    await goto("/");
  }

  let observer: MutationObserver;
  onMount(async () => {
    reset_inactivity();
    await tick();

    if ($kioskMode) {
      strip_links();

      observer = new MutationObserver((list, observer) => {
        strip_links();
      });

      observer.observe(document.documentElement, {
        attributes: true, childList: true, subtree: true
      });

      page.subscribe(() => { strip_links(); });
    }
  });

  onDestroy(() => {
    if (browser && observer != undefined) {
      observer.disconnect();
    }
  });

  async function strip_links() {
    await tick();
    for (let elem of document.getElementsByTagName("a") as HTMLCollectionOf<HTMLAnchorElement>) {
      let href: URL;
      try {
        href = new URL(elem.href);
      } catch (err) {
        continue;
      }

      if (href.origin != base_url.origin) {
        elem.href = "";
        // elem.tagName
      }
    }
  }
</script>

<svelte:window
  bind:innerHeight={$windowHeight}
  bind:innerWidth={$windowWidth}
  bind:scrollY={$scrollY}
  bind:scrollX={$scrollX}
  on:mousemove={reset_inactivity}
  on:mousedown={reset_inactivity}
  on:pointermove={reset_inactivity}
  on:pointerdown={reset_inactivity}
  on:touchmove={reset_inactivity}
  on:touchstart={reset_inactivity}
  on:keydown={reset_inactivity}
  on:scroll={reset_inactivity}
  on:focus={reset_inactivity} />

<div class="{$themeStore} app">
  <Header />
  <SvelteToast />
  <main>
    <slot />
  </main>
  <div
    class="grey"
    style={$page.url.pathname == "/"
      ? "position: absolute;"
      : "position: fixed;"}>
    <img
      loading="lazy"
      class={$page.url.pathname == "/timeline"
        ? "background grey ontimeline"
        : "background grey"}
      alt="Niagara-on-the-Lake Main Street"
      src="$lib/assets/landing-page-bg-4.webp" />
  </div>

  <div class="bg" />
  {#if !$page.url.pathname.startsWith("/timeline") }
    <Footer />
  {/if}
</div>

<style>
  :root {
    --toastBackground: var(--color-bg-1);
    --toastColor: var(--color-text);
    --toastBorderRadius: 0.8rem;
    --toastPadding: 0.5rem;
    --toastBarHeight: 0;
  }

  .background {
    user-select: none;
    opacity: var(--bg-opacity);
    width: clamp(100rem, 120vw, 200rem);
    filter: blur(0px);
    transition: filter 0.6s cubic-bezier(0.31, 0.21, 0.72, 0.61),
      opacity 0.6s cubic-bezier(0.31, 0.21, 0.72, 0.61);
  }

  .background.ontimeline {
    filter: blur(7px);
    opacity: calc(var(--bg-opacity) * 0.5);
  }

  .bg {
    user-select: none;
    position: fixed;
    z-index: -10;
    width: 100vw;
    height: 100vh;
    background-color: var(--color-bg-1);
  }

  .grey {
    user-select: none;
    transform-origin: bottom right;
    transform: scale(0.9);
    bottom: 0;
    right: 0;
    margin-bottom: -1rem;
    z-index: -9;
    filter: var(--bg-grayscale);
  }

  .app {
    display: flex;
    flex-direction: column;
    max-width: 100vw;
    min-height: 100vh;
    overflow-x: hidden;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 80%;
    margin: 0 auto;
    min-height: 88vh;
  }

  @media (max-width: 1000px) {
    .background.background.ontimeline {
      opacity: 0.1;
    }
  }

  @media (max-width: 600px) {
    .background.background.ontimeline {
      opacity: 0;
    }
  }
</style>
