import { error, redirect } from "@sveltejs/kit";

import supabase from "$lib/supabaseClient";
import { Entry, Timeline } from "$lib/models/timeline";

export async function load({ params }) {
  const timelines = await Timeline.select_all(supabase);
  const entry = await Entry.select(supabase, Number.parseInt(params.entry), timelines);

  if (entry == null) {
    throw error(404, "Item not found!");
  }

  throw redirect(301, `/timeline/${entry.timeline.id}/${entry.id}`);
}
