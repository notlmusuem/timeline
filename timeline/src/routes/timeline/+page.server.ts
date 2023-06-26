import { redirect } from "@sveltejs/kit";

import supabase from "$lib/supabaseClient";
import { Timeline } from "$lib/models/timeline";

export async function load({ params }) {
  let timelines = await Timeline.select_all(supabase);

  throw redirect(301, `/timeline/${timelines[0].id}`);  // moved permanently
}
