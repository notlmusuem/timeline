import { type Writable, writable } from "svelte/store";

import { Timeline } from "$lib/models/timeline";
import supabase from "$lib/supabaseClient";


export const timelines: Writable<Timeline[]> = writable(await Timeline.select_all(supabase));
