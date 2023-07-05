<script lang="ts">
  import QrEntry from "$lib/components/QrEntry.svelte";

  import { Entry } from "$lib/models/timeline";

  export let entry: Entry;
  export let url_origin: string;
</script>

<div class="item-card">
  <section class="item-component">
    <div class="media-component" style="border: 2px solid red;">
      <!-- <img src='$lib/assets/notl-museum.svg' width='400px' height='300px'/> -->
      <QrEntry {entry} size={2048} {url_origin} ssr={true} />
    </div>
    <div class="text-component">
      <h1 class="title">{entry.title}</h1>
      <p class="date"><i>{entry.format_date()}</i></p>
      {#if entry.body}<p class="desc">{entry.body}</p>{/if}
    </div>
  </section>
</div>

<style lang='less'>
  @font-sans: "Montserrat", -apple-system, sans-serif;
  @font-serif: "Lustria", serif;
  @font-mono: "Fira Mono", monospace;

  // @column-width: 42rem;
  // @column-margin-top: 4rem;

  @curve: cubic-bezier(0.08, 0.84, 0.1, 0.97);

  // --toastBorderRadius: 0.8rem;
  // --toastPadding: 0.5rem;
  // --toastBarHeight: 0;
  // --toastBackground: @color-bg-1;
  // --toastColor: @color-text;

  @button-color: @color-theme-1;
  @button-background: transparent;
  @button-border: @button-color;
  @button-hover-color: @color-bg-1;
  @button-hover-background: @button-color;
  @button-active-background: @color-theme-1-light;

  @button-disabled-color: #0000004d;
  @button-disabled-background: #0000001a;
  @button-disabled-border: @button-disabled-background;

  @background-gradient: linear-gradient(
    90deg,
    @color-bg-1 0%,
    @color-bg-2 100%
  );

  @font-size-xsmall: (@font-size-base * 0.66); /* 0.8rem */
  @font-size-small: (@font-size-base * 0.83); /* 0.99rem */
  @font-size-smallish: (@font-size-base * 0.9); /* 1.08rem */
  @font-size-base: (1.2 * 16px); /* 1.2rem */
  @font-size-medium: (@font-size-base * 1.2); /* 1.44rem */
  @font-size-large: (@font-size-base * 1.5); /* 1.8rem */
  @font-size-xlarge: (@font-size-base * 1.6); /* 1.92rem */
  @font-size-xxlarge: (@font-size-base * 2); /* 2.4rem */
  @font-size-xxxlarge: (@font-size-base * 3); /* 3.6rem */
  @font-size-xxxxlarge: (@font-size-base * 4); /* 4.8rem */

  .light-theme() {
    @color-bg-1: #fcfcfc;
    @color-bg-2: #e0dbd4;
    @color-text-card: #e9e6e1;
    @bg-opacity: 0.25;
    @arrow-opacity: 0.5;
    @arrow-border: 1px solid transparent;
    @bg-grayscale: grayscale(0);
    @color-theme-1: #9e0814;
    @color-theme-2: #08244b;
    @color-theme-1-light: #e94d5a;
    @color-theme-2-light: #8ab7f7;
    @color-text: rgba(0, 0, 0, 0.7);

    @nav-color: #fcfcfcbb;
    @footer: #961c26;

    @button-color: @color-theme-1;
    @button-background: transparent;
    @button-border: @button-color;
    @button-hover-color: @color-bg-1;
    @button-hover-background: @button-color;
    @button-active-background: @color-theme-1-light;

    @button-disabled-color: #0000004d;
    @button-disabled-background: #0000001a;
    @button-disabled-border: @button-disabled-background;

    @border: 1px solid #ccc;
  }

  .light-theme();

  :root {
    transition: background-color 0.5s @curve, color 0.5s @curve;
    font-family: @font-sans;
    color: @color-text;
  }

  body {
    min-height: 100vh;
    margin: 0;
  }

  h1,
  h2,
  p {
    font-weight: 400;
  }

  p {
    line-height: 1.5 * 16px;
  }

  a {
    color: @color-theme-1;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: @color-theme-1-light;
    text-decoration: underline;
  }

  h1 {
    font-family: @font-serif;
    font-size: @font-size-xxlarge;
    font-weight: 700;
    margin: 1rem 0;
    margin-top: 3rem;
  }

  p {
    margin: 1.25rem 0;
  }

  h1 {
    font-size: @font-size-xxlarge;
  }

  h2 {
    font-size: @font-size-base;
  }

  p {
    font-size: @font-size-base;
  }

  details, summary, ul, li {
    font-size: @font-size-base;
  }

  hr {
    margin-top: 2rem;
    width: 66%;
    height: 1px;
    border: none;
    opacity: 0.33;
    background-color: @color-text;
  }

  p {
    font-family: @font-sans;
    font-size: @font-size-base;
  }

  caption {
    font-family: @font-sans;
    font-size: @font-size-base;
  }


  .item-card {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100%;
    padding: 2rem;
  }

  .item-component {
    display: flex;
    flex-direction: row;
    // flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    // margin-bottom: 3rem;
    gap: 1.5rem;
    // max-width: 60rem;

    border-radius: 1.5rem;
    border: 1px solid #ccc;
    filter: drop-shadow(5px 5px 7px 0 #00000020);

    background: @color-text-card;

    padding: 2rem;
  }

  .media-component {
    flex: 1 2 30%;

    display: flex;

  }

  .text-component {
    flex: 1 2 70%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding: 1rem 2rem;

    text-align: justify;
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
    font-size: @font-size-xsmall;
  }

  .image_cred a {
    color: @color-text;
    opacity: 0.5;
    transition: all 0.3s @curve;
  }

  .image_cred a:hover {
    opacity: 1;
    color: @color-theme-1;
    text-decoration: none;
  }

  .title {
    margin: 1.5rem 0;
    text-align: center;
  }

  .date {
    text-align: center;
    padding: 0;
    font-size: @font-size-medium;
    font-weight: 400;
  }

  .desc {
    text-align: justify;
  }

  .image-cont {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    border: @border;
    border-radius: 1.5rem;
    max-width: 100%;
    background: @color-text-card;
    box-shadow: 5px 5px 7px 0 #00000020;
  }

  .image-placeholder {
    display: flex;
    border-radius: 1.5rem;
    border-bottom: @border;
  }

  .image {
    z-index: 2;
    cursor: pointer;
    min-height: 10em;
    max-height: 20em;
    object-position: center center;
    object-fit: contain;
    border-radius: 1.5rem;
  }

  .image-caption {
    /* width: 100%; */
    padding: 0.25em;
  }

  @media (max-width: 1000px) {
    .text-component {
      padding: 1rem 1.5rem;
    }
    .title {
      font-size: @font-size-large;
    }
    .date {
      font-size: @font-size-base;
    }
    .desc {
      font-size: @font-size-small;
    }
    .image {
      min-height: 0vh;
      max-height: 40vh;
    }
  }

  @vid-ratio: 0.5625;
  .video {
    z-index: 2;
    max-width: 50vw;
    width: 60vw;
    height: calc(60vw * @vid-ratio);
    object-position: center center;
    object-fit: cover;
    border-radius: 1.5rem;
    box-shadow: 1rem 0rem 7px 0 #00000030;
  }

  .red {
    font-weight: 700;
    color: @color-theme-1;
  }
</style>
