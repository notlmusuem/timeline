import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";


export interface Table {
  // typescript does not support static interface members well enough right now
  // select_all(conx: SupabaseClient): Promise<[this]>;

  // Inserts this object as a new row into the remote database.
  // Promise rejection type: PostgrestError
  insert(conx: SupabaseClient): Promise<this>;

  // Updates the row references by this object into the remote database.
  // Promise rejection type: PostgrestError
  update(conx: SupabaseClient): Promise<this>;

  // Deletes the row references by this object into the remote database.
  // Promise rejection type: PostgrestError
  delete(conx: SupabaseClient): Promise<void>;
}


export class Entry implements Table {
  // A null id indicates this is not yet present in the table
  id: number|null = null;
  title: string;
  image: string|null = null;
  image_credit: string|null = null;
  body: string|null = null;
  start_date: Date;
  start_date_precision: "day"|"month"|"year"|"decade" = "day";
  end_date: Date|null = null;
  end_date_precision: "day"|"month"|"year"|"decade"|null = null;

  constructor(title: string, start_date: Date) {
    this.title = title;
    this.start_date = start_date;
  }

  static new_default() {
    return new Entry("", new Date());
  }

  private static from_row(row: {
    id: number, title: string, image: string|null, image_credit: string|null,
    body: string|null, start_date: string,
    start_date_precision: "day"|"month"|"year"|"decade", end_date: string|null,
    end_date_precision: "day"|"month"|"year"|"decade"|null
  }): Entry {
    return {
      id: row.id,
      title: row.title,
      image: row.image,
      image_credit: row.image_credit,
      body: row.body,
      start_date: new Date(Date.parse(row.start_date)),
      start_date_precision: row.start_date_precision,
      end_date: row.end_date == null
        ? null : new Date(Date.parse(row.end_date)),
      end_date_precision: row.end_date_precision,
    } as Entry;
  }

  static async select_all(conx): Promise<Entry[]> {
    const { data, error } = await conx
      .from("timeline")
      .select(
        `id, title, image, image_credit, body, start_date, start_date_precision,
        end_date, end_date_precision`
      )
      .order("start_date");
    if (error) { throw error as PostgrestError; }
    return data.map(Entry.from_row);
  }

  async insert(conx: SupabaseClient<any, "public", any>) {
    const { data, error } = await conx.from("timeline").insert(
      {
        title: this.title,
        image: this.image,
        image_credit: this.image_credit,
        body: this.body,
        start_date: this.start_date,
        start_date_precision: this.start_date_precision,
        end_date: this.end_date,
        end_date_precision: this.end_date_precision,
      }).select("id");
    if (error) { throw error as PostgrestError; }
    this.id = data[0].id;
    return this;
  }

  async update(conx: SupabaseClient<any, "public", any>) {
    const { error } = await conx.from("timeline").update({
      title: this.title,
      image: this.image,
      image_credit: this.image_credit,
      body: this.body,
      start_date: this.start_date,
      start_date_precision: this.start_date_precision,
      end_date: this.end_date,
      end_date_precision: this.end_date_precision,
    }).eq("id", this.id);
    if (error) { throw error as PostgrestError; }
    return this;
  }

  async delete(conx: SupabaseClient<any, "public", any>) {
    const { error } = await conx
      .from("timeline")
      .delete()
      .eq("id", this.id);
    if (error) { throw error as PostgrestError; }
  }

  // Determines if item is present in the remote table, or if not, it is local.
  in_table = {
    get: (): boolean => this.id != null
  };
}
