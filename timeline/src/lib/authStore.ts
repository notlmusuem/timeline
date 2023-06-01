import supabase from "$lib/supabaseClient";
import { AuthError, User } from "@supabase/supabase-js";
import { Writable, writable } from "svelte/store";
import { toast } from "@zerodevx/svelte-toast";


export const userStore: Writable<User | null> = writable(null);


// obtain user info from current session
export async function getSessionUser() {
  const { data: { session } } = await supabase.auth.getSession();

  userStore.set(session?.user ?? null);
  return session?.user ?? null;
}

// Login using a one-time-password delivered via a magic link.
// note: This authentication mechanism will create accounts for any email passed
// to this function if they don't have one!
export async function login_otp(email) {
  try {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) { throw error; }
    toast.push("<b>Success</b><br>Check your email for a login link");
    return await getSessionUser();

  } catch (error) {
    if ((error as AuthError).status === 403) {
      toast.push("<b>Error</b><br>Please login with a verified admin account");
    } else {
      toast.push(`<b>Error</b><br>${(error as AuthError).message}`);
    }
  }
  return;
};

// Login with a username and password combo
export async function login_pw(email, password) {
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { throw error; }
    toast.push("<b>Success</b><br>Logged in");

    return await getSessionUser();
  } catch (error) {
    if ((error as AuthError).status === 403) {
      toast.push("<b>Error</b><br>Incorrect username or password");
    } else {
      toast.push(`<b>Error</b><br>${(error as AuthError).message}`);
    }
    return null;
  }
};

export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    location.reload();
    if (error) { throw error; }
    toast.push("<b>Success</b><br>Successfully signed out");
  } catch (error) {
    toast.push("<b>Error</b><br>" + (error as AuthError).message);
  }
  return;
};
