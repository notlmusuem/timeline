<script lang="ts">
  export let short: boolean = false;
</script>

{#if short}
  &copy; 2023, by the project contributors <a href="/about#about-this-timeline">Alec Ames et al.</a>
  Freely licensed under <a href="https://github.com/notlmusuem/timeline">MIT</a>.
  <br>Funded in part by ... and Brock University through the ... grant.
{:else}
  &copy; 2023, by the project contributors <span class='nbr'>Alec Ames</span>, <span class='nbr'>Ibrahim Hashmi</span>, <span class='nbr'>Francis Monwe</span>, <span class='nbr'>Matthew Benson</span>, <span class='nbr'>Tommy Pham</span>, <span class='nbr'>Abhijeet Prajapati</span>, <span class='nbr'>Justin Stickel</span>, <span class='nbr'>Haaris Yahya</span>, and under the supervision of <span class='nbr'>Naser Ezzati-Jivan</span>, by <span class='nbr'>Muhammed Bilal</span> and <span class='nbr'>Michael Boulet</span>.
  Freely licensed under <a href="https://github.com/notlmusuem/timeline">MIT</a>.
  Funded in part by ... and Brock University through the ... grant.
{/if}

<style>
  .nbr {
    word-break: keep-all;
    white-space: nowrap;
  }
</style>
