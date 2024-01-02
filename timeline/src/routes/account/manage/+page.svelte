<script lang="ts">
  import { onMount } from "svelte";
  import { escape } from "svelte/internal";
  import { toast } from "@zerodevx/svelte-toast";
  import * as navigation from "$app/navigation";
  import { type User } from "@supabase/supabase-js";
  import supabase from "$lib/supabaseClient";

  import { sleep, validateEmail } from "$lib/utils";
  import {
    is_admin, password_requirements, update_user, userStore as user
  } from "$lib/authStore";

  import Button from "$lib/components/Button.svelte";
  import PageMeta from "$lib/components/PageMeta.svelte";
  import PageTransition from "$lib/components/PageTransitionFly.svelte";


  let users: User[] = [];

  onMount(async () => {
    // await sleep(1500);
    if ($user == null || !is_admin($user)) {
      navigation.goto("/login");
      return;
    }
    users = (await supabase.auth.admin.listUsers({ perPage: 5000 })).data.users;
  });
</script>

<PageMeta titles={["Account Settings"]} site_name="NOTL Musuem" />

<PageTransition>
  <div class="login-container">
    {#if $user && $user.email && is_admin($user)}
      <h1>Manage Users</h1>
      <div style='max-width: 70ch; text-align: center;'>

      </div>

      <div class="grid">
        {#each users as user}
          <p>{user.email}</p>
        {/each}
      </div>
    {/if}
  </div>
</PageTransition>

<style lang="less">
  *, *::after, *::before {
    box-sizing: border-box;
  }

  label {
    padding-left: 1rem;
    color: var(--color-text);
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--color-text);
    opacity: 0.5;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 0.9em;

    border-radius: var(--font-size-xsmall) var(--font-size-xsmall) 0 0;
    border: var(--border);
    outline: none;

    background-color: transparent;
    backdrop-filter: invert(0.1) sepia(0.1) saturate(0.1) brightness(1.1) contrast(1.1);
    box-shadow: inset 0 -4px 0 -1px var(--color-theme-1);

    text-overflow: ellipsis;
    text-align: start;
    font-size: var(--font-size-small);
    font-family: var(--font-sans);
    color: var(--color-text);

    transition: all 0.3s var(--curve);

    &:disabled {
      background-color: var(--button-disabled-background);
      box-shadow: inset 0 -4px 0 -1px var(--color-theme-1);
    }

    &.error {
      border: 1px solid var(--color-theme-1);
      box-shadow: inset 0 -4px 0 -1px var(--color-theme-1);
    }
  }

  textarea {
    height: clamp(10rem, 20vh, 30rem);
    resize: none;
  }

  input:focus,
  textarea:focus {
    box-shadow: inset 0 -6px 0 -1px var(--color-theme-1);
  }

  .forms-grid {
    display: grid;
    grid: auto-flow / minmax(25ch, 1fr) 1fr;
    gap: 2rem;
    align-items: center;
    margin: 0 auto;

    // collapse to one column on small screen widths
    @media (max-width: 800px) {
      grid: auto-flow / 1fr;
    }

    & > * {
      border-radius: 1.5rem;
      border: var(--border);
      background-color: var(--color-bg-1);
      // filter: drop-shadow(5px 5px 7px 0 #00000020);
      box-shadow: 5px 5px 7px 0 #0000004d;
    }
  }

  hr {
    width: 75%;
    color: var(--color-theme-2);
    border-style: solid;
  }

  h1, h3 {
    margin-block: 0 0.5em;
    text-align: center;
  }

  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .form {
    padding: 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: left;
  }

  .form-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 100%;
  }

  .form label {
    padding: 0 0 0 1em;
    margin-top: 1rem;
  }
</style>
