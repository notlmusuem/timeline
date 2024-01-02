<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import Button from "$lib/components/Button.svelte";
  import { logout, userStore as user } from "$lib/authStore";

  const dispatch = createEventDispatcher();
</script>

<div class="settings-grid">
  <h3 class="title" style="word-break: break-all;">
    <i class="material-symbols-rounded" style='vertical-align: middle;'>account_circle</i>
    {$user?.email}</h3>

  <div class='col'>
    <Button alt
      on:click={() => { dispatch("close"); }}
      href="/account/edit">
      <i class="material-symbols-rounded">key</i>
      Change Password/Email
    </Button>
    <!-- not implemented!!! <Button alt
      on:click={() => { dispatch("close"); }}
      href="/account/manage">
      <i class="material-symbols-rounded">manage_accounts</i>
      Manage Users
    </Button> -->
    <Button alt
      title="Logout"
      on:click={() => { logout(); dispatch("close"); }}>
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

  .col {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
  }
</style>
