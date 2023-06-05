import supabase from "$lib/supabaseClient";
import { Entry } from "$lib/models/timeline";

export async function load() {
  return {
    // svelte's load does not support serializing non-json objects (why?)
    timeline: (await Entry.select_all(supabase)).map(e => e.to_obj())
  };
}
