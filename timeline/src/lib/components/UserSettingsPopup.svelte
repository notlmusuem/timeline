<script lang="ts">
  import supabase from "$lib/supabaseClient.js";
  import { type Writable, writable } from "svelte/store";

  import Button from "$lib/components/Button.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import { logout, userStore as user } from "$lib/authStore";
</script>

<div class="settings-grid">
  <h3 class="title">
    <i class="material-symbols-rounded" style='vertical-align: middle;'>account_circle</i>
    {$user?.email}</h3>

  <div class='col'>
    <Button alt
      href="/account/edit">
      <i class="material-symbols-rounded">key</i>
      Change Password/Email
    </Button>
    <Button alt
      href="/account/manage">
      <i class="material-symbols-rounded">manage_accounts</i>
      Manage Users
    </Button>
    <Button alt
      title="Logout"
      on:click={() => { logout(); }}>
      <i class="material-symbols-rounded">logout</i>
      Logout
    </Button>
  </div>
</div>

<style lang="less">
  .settings-grid {
    padding: 1.5rem;

    display: grid;
    grid: auto-flow / 1fr;
    gap: 8px;
    align-items: center;
    margin: 0 auto;

    // on small widths, don't take up more than 85% of the screen width
    max-width: 20rem;
    overflow-y: scroll;
  }

  .title {
    margin: 0;
  }

  .cell(@size) {
    grid-column-end: span @size;
  }

  .cell1 { .cell(1); }
  .cell2 { .cell(2); }
  .cell3 { .cell(3); }
  .cell4 { .cell(4); }
  .cell5 { .cell(5); }
  .cell6 { .cell(6); }
  .cell7 { .cell(7); }
  .cell8 { .cell(8); }

  .col {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
  }

  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
  }

  .btn-row {
    display: flex;
    flex-direction: row;
  }

  .small-dialog-msg {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    gap: 0.5em;
  }

  .small-dialog-msg > * {
    // flex-basis: 15em;
    max-width: 30em;
    text-align: justify;
    margin: 0;
  }
</style>
