import { redirect } from "@sveltejs/kit";

import supabase from "$lib/supabaseClient";
import { Entry, Timeline } from "$lib/models/timeline";
import { parseIntNull } from "$lib/utils";

export async function load({ params }) {
  let timelines = await Timeline.select_all(supabase);

  return {
    // svelte's load does not support serializing non-json objects
    timelines: timelines.map(tl => tl.to_obj()),
  };
}

export const trailingSlash = "never";
