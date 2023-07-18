import { error } from "@sveltejs/kit"
import { image_from_component, type RenderOptions } from "svelte-component-to-image";
import { buffer_to_datauri, parseIntNull } from "$lib/utils";
import supabase from "$lib/supabaseClient";

import ItemCard from "$lib/components/ItemCard.svelte";
import QrEntry from "$lib/components/QrEntry.svelte";

import { qr_from_entry } from "$lib/qr";
import { Entry, Timeline } from "$lib/models/timeline";


import lustria_path from "$lib/assets/fonts/lustria/lustria.ttf";
import montserrat_path from "$lib/assets/fonts/montserrat/static/montserrat-regular.ttf";
import montserrati_path from "$lib/assets/fonts/montserrat/static/montserrat-italic.ttf";

let fonts: null|{
  lustria: ArrayBuffer, montserrat: ArrayBuffer, montserrati: ArrayBuffer
} = null;


export async function GET({url, params, fetch}) {
  const entry_id: number|null = params.entry == undefined
    ? null : parseIntNull(params.entry) as number;

  if (entry_id == null) {
    throw error(404, "Timeline entry not found!");
  }

  const timelines = await Timeline.select_all(supabase);
  const entry = await Entry.select(supabase, entry_id, timelines);

  if (entry == null) {
    throw error(404, "Timeline entry not found!");
  }

  if (fonts != null) {
    fonts = {
      lustria: await (await fetch(lustria_path)).arrayBuffer(),
      montserrat: await (await fetch(montserrat_path)).arrayBuffer(),
      montserrati: await (await fetch(montserrati_path)).arrayBuffer(),
    };
  }

  const qr_datauri = buffer_to_datauri(
    await qr_from_entry(entry, {
      size: 2048, color: true
    }).toBuffer("png"),
    "image/png"
  );

  // todo: patch upstream library to support directly loading fonts from arraybuffer with fonts.data
  // todo: remove static/assets symlink after direct loading fonts from filesystem
  try {
    const options: RenderOptions = {
      width: 1200,
      height: 600,
      props: {
        entry: entry,
        url_origin: url.origin,
        qr_datauri: qr_datauri,
        qr_size: 2048
      },
      fonts: [
        {
          name: "Lustria",
          data: fonts?.lustria,
          url: `${url.origin}/assets/fonts/lustria/lustria.ttf`,
          weight: 400,
          style: "normal"
        },
        {
          name: "Montserrat",
          data: fonts?.montserrat,
          url: `${url.origin}/assets/fonts/montserrat/static/montserrat-regular.ttf`,
          weight: 400,
          style: "normal"
        },
        {
          name: "Montserrat",
          data: fonts?.montserrati,
          url: `${url.origin}/assets/fonts/montserrat/static/montserrat-italic.ttf`,
          weight: 400,
          style: "italic"
        }
      ],
    }

    // pass the component and options to the package
    const image = await image_from_component(ItemCard, options);
    const response = new Response(image);
    response.headers.append("Content-Type", "image/png");
    response.headers.append("Cache-Control", "s-maxage=604800, stale-while-revalidate=604800");
    return response;
  } catch (e) {
    console.error(e)
    throw error(500, "Error trying to generate image from component.")
  }
}
