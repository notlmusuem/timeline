<script lang="ts">
  import { onMount } from "svelte";
  import { escape } from "svelte/internal";
  import { toast } from "@zerodevx/svelte-toast";
  import * as navigation from "$app/navigation";

  import { sleep, validateEmail } from "$lib/utils";
  import {
  is_admin,
    password_requirements, update_user, userStore as user
  } from "$lib/authStore";

  import Button from "$lib/components/Button.svelte";
  import PageMeta from "$lib/components/PageMeta.svelte";
  import PageTransition from "$lib/components/PageTransitionFly.svelte";


  let new_email: string;
  let new_email_error = false;
  let form_email_loading = false;

  let new_password: string;
  let new_password_error = false;
  let new_password_confirm: string;
  let new_password_confirm_error = false;
  let form_password_loading = false;

  async function flow_update_email(email) {
    new_email_error = false;
    form_email_loading = false;

    if (email === undefined || email === "") {
      toast.push(`<b>Error</b><br>New email cannot be empty!`);
      new_email_error = true;
      return;
    }

    if (!validateEmail(email)) {
      toast.push("<b>Error</b><br>Provided email is not a valid email!");
      new_email_error = true;
      return;
    }

    new_email_error = false;
    form_email_loading = true;

    try {
      if (await update_user({
        email: new_email
      })) {
        toast.push(`<b>Success</b><br>Check your inbox at ${escape(new_email)} to confirm the new email!`);
      }
    } finally {
      form_email_loading = false;
    }
  }

  async function flow_update_password(password, confirm) {
    new_password_error = false;
    new_password_confirm_error = false;
    form_password_loading = false;

    if (password === undefined || password === "") {
      toast.push(`<b>Error</b><br>New password cannot be empty!`);
      new_password_error = true;
      return;
    }

    if (confirm === undefined || confirm === "") {
      toast.push(`<b>Error</b><br>Confirm password cannot be empty!`);
      new_password_confirm_error = true;
      return;
    }

    let requirements = password_requirements(password);
    if (requirements.length > 0) {
      toast.push(`<b>Error</b><br>${requirements[0]}`);
      new_password_error = true;
      return;
    }


    if (password != confirm) {
      toast.push("<b>Error</b><br>Confirm password does not match!");
      new_password_confirm_error = true;
      return;
    }

    new_password_confirm_error = false;
    form_password_loading = true;


    try {
      if (await update_user({
        password: new_password
      })) {
        toast.push("<b>Success</b><br>Password successfully updated!");
      }
    } finally {
      form_password_loading = false;
    }
  }

  onMount(async () => {
    await sleep(1500);
    if ($user == null) {
      navigation.goto("/login");
    }
  });
</script>

<PageMeta titles={["Account Settings"]} site_name="NOTL Musuem" />

<PageTransition>
  <div class="login-container">
    {#if $user && $user.email}
      <h1>Account Settings</h1>
      <div style='max-width: 70ch; text-align: center;'>
        <p>You are logged in as
          <i class="material-symbols-rounded" style='vertical-align: middle;'>account_circle</i>
          {$user?.email}
          {#if is_admin($user)}
            <br>To change settings for another user or to create a new user visit the <a href='/account/manage'>manage users page</a>.
          {/if}
        </p>
      </div>

      <div class='forms-grid'>

        <form class="form">
          <h3>Change Email</h3><hr>

          <label for="email">Current Email</label>
          <input type="email" id="new_email" disabled autocomplete="off"
            bind:value={$user.email}
            placeholder="username@email.com" />

          <label for="email">New Email</label>
          <input type="email" id="email" autocomplete="email"
            bind:value={new_email}
            placeholder="username@email.com" />

          <div class="form-buttons">
            <Button alt
              on:click={() => { flow_update_email(new_email); }}
              loading={form_email_loading}>
              <i class="material-symbols-rounded">email</i>
              Change Email
            </Button>
          </div>
        </form>

        <form class="form">
          <h3>Change Password</h3><hr>

          <label for="email">New Password</label>
          <input type="password" id="password" autocomplete="new-password"
            class={new_password_error ? "error" : ""}
            bind:value={new_password}
            placeholder="password" />
          <label for="email">Confirm Password</label>
          <input type="password" id="password" autocomplete="new-password"
            class={new_password_confirm_error ? "error" : ""}
            bind:value={new_password_confirm}
            placeholder="password" />

          <div class="form-buttons">
            <Button alt loading={form_password_loading}
              on:click={() => {
                flow_update_password(new_password, new_password_confirm);
              }}>
              <i class="material-symbols-rounded">key</i>
              Change Password
            </Button>
          </div>
        </form>

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
