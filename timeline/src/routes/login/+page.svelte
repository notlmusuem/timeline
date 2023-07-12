<script lang="ts">
  import { type User } from "@supabase/supabase-js";
  import * as navigation from "$app/navigation";
  import { login_pw, logout, userStore } from "$lib/authStore";

  import PageTransition from "$lib/components/PageTransitionFly.svelte";
  import Button from "$lib/components/Button.svelte";


  let user: User|null;
  userStore.subscribe((value) => {
    user = value;
  });

  let loading = false;

  let email: string;
  let password: string;
  async function handleLogin() {
    loading = true;
    await login_pw(email, password);
    navigation.goto("/");
    loading = false;
  }
</script>

<svelte:head>
  <title>Log In | Niagara-on-the-Lake Timeline</title>
  <meta name="description" content="Log in to your account" />
</svelte:head>

<PageTransition>
  <div class="login-container">
    {#if user && user.email}
      <h1>You are logged in!</h1>
      <p>Click the button below to log out</p>
      <div class="form">
        <div class="form-buttons">
          <div><Button href="/">Back</Button></div>
          <div>
            <Button alt on:click={logout} {loading}>
              <i class="material-symbols-rounded">logout</i>Log Out
            </Button>
          </div>
        </div>
      </div>
    {:else}
      <h1>Log In</h1>
      <p>Enter your email and password to login.</p>

      <div class="form">
        <label for="email">Email</label>
        <input
        type="email"
        id="email"
        bind:value={email}
        placeholder="username@email.com" />
        <label for="email">Password</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          placeholder="password" />

        <div class="form-buttons">
          <div><Button href="/">Back</Button></div>
          <div>
            <Button alt on:click={handleLogin} {loading}>
              <i class="material-symbols-rounded">login</i>Log In
            </Button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</PageTransition>

<style>
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .form {
    display: flex;
    flex-direction: column;
    align-items: left;
  }
  .form-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
  .form label {
    padding: 0 0 0 1em;
    margin-top: 1rem;
  }
  .form input {
    text-align: left;
    max-width: 30rem;
    margin: 0.5em 0.5em 2em;
    padding: 0.8em;
    border-radius: 0.5em;
    border: 2px solid white;
    box-shadow: 0 0 1px 1px #0000004d;
    transition: border 0.15s ease;
  }
  input:focus {
    outline: none;
    border: 2px solid #000000;
  }
</style>
