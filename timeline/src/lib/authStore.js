// @ts-nocheck
import supabase from "$lib/supabaseClient";
import { writable } from "svelte/store";
import { toast } from "@zerodevx/svelte-toast";

export const userStore = writable({});

// obtain user info from current session
export async function getSessionUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session && session.user) {
    userStore.set(session.user);
    return session.user;
  }
  return null;
}

// handle logins
export const login = async (email) => {
  try {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
    toast.push("<b>Success</b><br>Check your email for a login link");
  } catch (error) {
    if (error.status === 403) {
      toast.push(
        "<b>Error</b><br>" + "Please login with a verified admin account"
      );
    } else {
      toast.push("<b>Error!</b><br>" + error.message);
    }
  }
  return;
};

export const login_pw = async (email, password) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    toast.push("<b>Success</b><br>Logged in");
    return await getSessionUser();
  } catch (error) {
    if (error.status === 403) {
      toast.push("<b>Error</b><br>Incorrect username or password.");
    } else {
      toast.push(`<b>Error!</b><br>${error.message}`);
    }
    return null;
  }
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    location.reload();
    if (error) throw error;
    toast.push("<b>Success</b><br>Successfully signed out");
  } catch (error) {
    toast.push("<b>Error:</b><br>" + error.message);
  }
  return;
};
