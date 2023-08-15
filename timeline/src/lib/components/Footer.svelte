<script lang="ts">
  import { kioskMode } from "$lib/stores/store";

  import Socials from "$lib/components/Socials.svelte";
  import Copyright from "./Copyright.svelte";
</script>

<footer class="footer">
  <div class="bar" />
  {#if !$kioskMode}
  <div class="footer-container">
    <div class="footer-column">
        <h4>Niagara-on-the-Lake Musuem</h4>
        <p>
          <a
            href="https://www.notlmuseum.ca/"
            target="_blank"
            rel="noopener"
            ><span class="material-symbols-rounded i">web</span>&nbsp;
            <a href="https://www.notlmuseum.ca/" on:click|preventDefault>notlmuseum.ca</a>
          </a>
        </p>
        <!-- <p>
          <a
            href="https://goo.gl/maps/Cpm4nsawtRitVMHx6"
            target="_blank"
            rel="noopener noreferrer"
            ><span class="material-symbols-rounded i">location_on</span>&nbsp;43
            Castlereagh St, Niagara-on-the-Lake, ON L0S 1J0</a>
        </p>
        <p>
          <a href="tel:9054683912"
            ><span class="material-symbols-rounded i">phone</span>&nbsp;(905)
            468-3912</a>
        </p> -->
        <Socials grey />
      </div>
      <div class="footer-column">
        <h4>Site Links</h4>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About Us</a></li>
          <li><a href="/privacy">Privacy Policy</a></li>
        </ul>
      </div>
      <div class="footer-column">
        <h4>Related Links</h4>
        <ul>
          <li><a href="https://www.notlmuseum.ca">NOTL Museum</a></li>
          <li><a
            href="https://artsandculture.google.com/partner/niagara-historical-society-museum"
            >Google Arts & Culture</a></li>
          <li><a href="https://brocku.ca/">Brock University</a></li>
        </ul>
      </div>
    </div>
    {/if}
    <div class="footer-bottom">
      <p style="font-size: var(--font-size-small); max-width: 80ch;"><Copyright short/></p>
    </div>
</footer>


<style>
  .footer {
    position: relative;
    width: 100%;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: var(--border);
    background-color: var(--color-bg-1);
  }

  .footer-container {
    display: flex;
    justify-content: space-around;
    max-width: 80rem;
    padding: 4rem 1rem;
    margin: 0 auto;
  }

  .footer-column {
    margin: 0 1rem;
  }

  .footer-column h4 {
    font-size: var(--font-size-small);
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .footer-column p {
    line-height: 2rem;
    font-size: var(--font-size-small);
  }

  .footer-column ul {
    list-style: none;
    padding: 0;
  }

  .footer-column li {
    margin-bottom: 0.5rem;
    font-size: var(--font-size-small);
  }

  * :global(a) {
    color: var(--color-text);
    text-decoration: none;
    transition: all 0.5s var(--curve);
  }

  * :global(a):hover {
    text-decoration: underline;
    color: var(--color-theme-1);
  }

  .footer-bottom {
    padding: 0 1rem;
    background-color: var(--footer);
    height: 4rem;
    color: #fcfcfc;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  @media (max-width: 768px) {
    .footer-container {
      flex-direction: column;
    }

    .footer-column {
      margin-bottom: 2rem;
    }
  }
</style>
