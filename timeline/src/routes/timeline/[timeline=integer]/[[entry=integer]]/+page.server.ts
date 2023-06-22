import { redirect } from "@sveltejs/kit";

import supabase from "$lib/supabaseClient";
import { Entry, Timeline } from "$lib/models/timeline";
import { parseIntNull } from "$lib/utils";

export async function load({ params }) {
  let timeline_id: number = parseIntNull(params.timeline) as number;
  let entry_id: number|null = params.entry == undefined
    ? null : parseIntNull(params.entry) as number;

  let timelines = await Timeline.select_all(supabase);
  let timeline = timelines.find(tl => tl.id == timeline_id);
  // if the timeline doesn't exist, redirect the user to the default one
  if (timeline == undefined) {
    throw redirect(301, "/timeline/");  // moved permanently
    return;
  }
  let entries = await Entry.select_all_from(supabase, timeline);


  return {
    // svelte's load does not support serializing non-json objects
    timelines: timelines.map(tl => tl.to_obj()),
    entries: entries.map(e => e.to_obj())
  };
}

export const trailingSlash = "never";
