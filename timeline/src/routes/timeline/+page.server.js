import supabase from "$lib/supabaseClient";

export async function load() {
  const { data } = await supabase
    .from("timeline")
    .select(`
      id, title, image, image_credit, body, start_date, start_date_precision,
      end_date, end_date_precision
    `)
    .order("start_date");
  return {
    timeline: data ?? [],
  };
}
