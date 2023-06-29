<script lang="ts">
  import { page } from "$app/stores";
  import { browser } from '$app/environment';

  export let titles: string[];
  export let site_name: string;
  export let description: string|null = null;
  export let image: string|null = null;

  // While the title is changed properly if the <title> tag was rendered on the
  // server, this does not hold true in the case where the client has rendered
  // the whole page (eg. after client-side navigation) because there are
  // several <title> tags and svelte gets confused. In this case we need to
  // manually update the title.
  $: if (browser) {
    document.title = `${titles.join(" | ")} | ${site_name}`;
  }
</script>


<title>{titles.join(" | ")} | {site_name}</title>
<meta property="og:title" content={titles.join(" | ")}>
<meta property="og:site_name" content={site_name}>
<meta property="og:locale" content="en_CA">
<meta property="og:type" content="website">

<!-- todo: add alternate locales for issue #15 -->
<!-- todo: also set <html lang={lang}> for that -->
<!-- <meta property="og:locale:alternate" content="fr_CA"> -->

{#if description != null}
  <meta property="og:description" content={description}>
  <meta name="description" content={description}>
{/if}

{#if $page.url != null}<meta property="og:url" content="{$page.url.toString()}">{/if}
{#if image != null}<meta property="og:image" content="{image}">{/if}
