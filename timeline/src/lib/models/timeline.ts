import { SupabaseClient, PostgrestError } from "@supabase/supabase-js";
import { utcToZonedTime } from "date-fns-tz";


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

  static from_obj(obj: {
    id: number|null, title: string, image: string|null, image_credit: string|null,
    body: string|null, start_date: string,
    start_date_precision: "day"|"month"|"year"|"decade", end_date: string|null,
    end_date_precision: "day"|"month"|"year"|"decade"|null
  }): Entry {
    const self = new Entry(obj.title, new Date());

    self.id = obj.id;
    self.title = obj.title;
    self.image = obj.image;
    self.image_credit = obj.image_credit;
    self.body = obj.body;
    self.start_date = utcToZonedTime(
      new Date(Date.parse(obj.start_date)),
      "UTC"
    );
    self.start_date_precision = obj.start_date_precision;
    self.end_date = obj.end_date == null
        ? null : utcToZonedTime(
          new Date(Date.parse(obj.end_date)),
          "UTC"
        );
    self.end_date_precision = obj.end_date_precision;

    return self;
  }

  public to_obj(): {
    id: number|null, title: string, image: string|null, image_credit: string|null,
    body: string|null, start_date: string,
    start_date_precision: "day"|"month"|"year"|"decade", end_date: string|null,
    end_date_precision: "day"|"month"|"year"|"decade"|null
  } {
    // @ts-ignore typescript is dumb
    return { ...this };
  }

  static async select_all(conx: SupabaseClient): Promise<Entry[]> {
    const { data, error } = await conx
      .from("timeline")
      .select(
        `id, title, image, image_credit, body, start_date, start_date_precision,
        end_date, end_date_precision`
      )
      .order("start_date");
    if (error) { throw error as PostgrestError; }
    return data.map(Entry.from_obj);
  }

  async insert(conx: SupabaseClient): Promise<this> {
    const { data, error } = await conx.from("timeline").insert(
      {
        title: this.title,
        image: this.image,
        image_credit: this.image_credit,
        body: this.body,
        start_date: this.start_date.toUTCString(),
        start_date_precision: this.start_date_precision,
        end_date: this.end_date?.toUTCString() ?? null,
        end_date_precision: this.end_date_precision,
      }).select("id");
    if (error) { throw error as PostgrestError; }
    this.id = data[0].id;
    return this;
  }

  async update(conx: SupabaseClient) {
    const { error } = await conx.from("timeline").update({
      title: this.title,
      image: this.image,
      image_credit: this.image_credit,
      body: this.body,
      start_date: this.start_date.toUTCString(),
      start_date_precision: this.start_date_precision,
      end_date: this.end_date?.toUTCString() ?? null,
      end_date_precision: this.end_date_precision,
    }).eq("id", this.id);
    if (error) { throw error as PostgrestError; }
    return this;
  }

  async delete(conx: SupabaseClient) {
    const { error } = await conx
      .from("timeline")
      .delete()
      .eq("id", this.id);
    if (error) { throw error as PostgrestError; }
  }

  // Determines if item is present in the remote table, or if not, it is local.
  public get in_table(): boolean { return this.id != null; }
}
