import { runtime_writable } from "$lib/ext/store";

import supabase from "$lib/supabaseClient";
import { Timeline } from "$lib/models/timeline";


export const timelines = runtime_writable<Timeline[]>([], set => {
  (async () => {
    set(await Timeline.select_all(supabase));
  })();
});
