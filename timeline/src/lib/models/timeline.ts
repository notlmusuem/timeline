import { SupabaseClient, PostgrestError } from "@supabase/supabase-js";
import { UTCDate } from "@date-fns/utc";
import * as datefn from "date-fns-tz";


export interface Table {
  // typescript does not support static interface members well enough right now
  // select_all(conx: SupabaseClient): Promise<[this]>;

  /**
   * Inserts this object as a new row into the remote database.
   * Promise rejection type: PostgrestError
   */
  insert(conx: SupabaseClient): Promise<this>;

  /**
   * Updates the row references by this object into the remote database.
   * Promise rejection type: PostgrestError
   */
  update(conx: SupabaseClient): Promise<this>;

  /**
   * Deletes the row references by this object into the remote database.
   * Promise rejection type: PostgrestError
   */
  delete(conx: SupabaseClient): Promise<void>;
}


export class Entry implements Table {
  /** A null id indicates this is not yet present in the table. */
  id: number|null = null;
  timeline: Timeline;
  title: string;
  image: string|null = null;
  image_credit: string|null = null;
  body: string|null = null;
  start_date: UTCDate;
  start_date_precision: "day"|"month"|"year"|"decade" = "day";
  end_date: UTCDate|null = null;
  end_date_precision: "day"|"month"|"year"|"decade"|null = null;

  constructor(timeline: Timeline, title: string, start_date: UTCDate) {
    this.timeline = timeline;
    this.title = title;
    this.start_date = start_date;
  }

  static new_default() {
    return new Entry(DEFAULT_TIMELINE, "", new UTCDate());
  }

  static from_obj(obj: {
    id: number|null, timeline: number, title: string,
    image: string|null, image_credit: string|null,
    body: string|null, start_date: string,
    start_date_precision: "day"|"month"|"year"|"decade", end_date: string|null,
    end_date_precision: "day"|"month"|"year"|"decade"|null
  }, timelines_ref: Timeline[]): Entry {
    const timeline = timelines_ref.find(tl => tl.id == obj.timeline)
    if (timeline === undefined) {
      throw new Error(`Timeline ${obj.timeline} not found for entry ${obj.id}!`);
    }

    const self = new Entry(timeline, obj.title, new UTCDate());

    self.id = obj.id;

    self.timeline = timeline;
    self.title = obj.title;
    self.image = obj.image;
    self.image_credit = obj.image_credit;
    self.body = obj.body;
    self.start_date = new UTCDate(UTCDate.parse(obj.start_date));
    self.start_date_precision = obj.start_date_precision;
    self.end_date = obj.end_date == null
      ? null : new UTCDate(UTCDate.parse(obj.end_date));
    self.end_date_precision = obj.end_date_precision;

    return self;
  }

  public to_obj(): {
    id: number|null, timeline: number, title: string,
    image: string|null, image_credit: string|null,
    body: string|null, start_date: string,
    start_date_precision: "day"|"month"|"year"|"decade", end_date: string|null,
    end_date_precision: "day"|"month"|"year"|"decade"|null
  } {
    // @ts-ignore typescript is dumb
    return {
      ...this,
      // note: when implementing localization, use options { locale: enCA }
      start_date: datefn.formatInTimeZone(this.start_date, "UTC", "yyyy-MM-dd"),
      end_date: this.end_date == null
        ? null : datefn.formatInTimeZone(this.end_date, "UTC", "yyyy-MM-dd"),
      timeline: this.timeline.id
    };
  }

  static async select_all(conx: SupabaseClient): Promise<Entry[]> {
    const timeline = DEFAULT_TIMELINE;  // note: temp fix; see eof
    const { data, error } = await conx
      .from("timeline")
      .select(
        `id, title, image, image_credit, body,
        start_date, start_date_precision,
        end_date, end_date_precision`
      )
      .eq("timeline", timeline.id)
      .order("start_date");
    if (error) { throw error as PostgrestError; }

    return data.map(obj => Entry.from_obj({
      ...obj, timeline: timeline.id as number
    }, [timeline]));
  }

  static async select_all_from(conx: SupabaseClient, timeline: Timeline): Promise<Entry[]> {
    const { data, error } = await conx
      .from("timeline")
      .select(
        `id, title, image, image_credit, body,
        start_date, start_date_precision,
        end_date, end_date_precision`
      )
      .eq("timeline", timeline.id)
      .order("start_date");
    if (error) { throw error as PostgrestError; }

    return data.map(obj => Entry.from_obj({
      ...obj, timeline: timeline.id as number
    }, [timeline]));
  }

  async insert(conx: SupabaseClient): Promise<this> {
    const { data, error } = await conx.from("timeline").insert(
      {
        timeline: this.timeline.id,
        title: this.title,
        image: this.image,
        image_credit: this.image_credit,
        body: this.body,
        start_date: datefn.formatInTimeZone(this.start_date, "UTC", "yyyy-MM-dd"),
        start_date_precision: this.start_date_precision,
        end_date: this.end_date == null
          ? null : datefn.formatInTimeZone(this.end_date, "UTC", "yyyy-MM-dd"),
        end_date_precision: this.end_date_precision,
      }).select("id");
    if (error) { throw error as PostgrestError; }
    this.id = data[0].id;
    return this;
  }

  async update(conx: SupabaseClient) {
    const { error } = await conx.from("timeline").update({
      timeline: this.timeline.id,
      title: this.title,
      image: this.image,
      image_credit: this.image_credit,
      body: this.body,
      start_date: datefn.formatInTimeZone(this.start_date, "UTC", "yyyy-MM-dd"),
      start_date_precision: this.start_date_precision,
      end_date: this.end_date == null
        ? null : datefn.formatInTimeZone(this.end_date, "UTC", "yyyy-MM-dd"),
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

  /**
   * Determines if item is present in the remote table, or if not, it is local.
   */
  public get in_table(): boolean { return this.id != null; }
}


export class Timeline implements Table {
  /** A null id indicates this Item is not yet present in the table */
  id: number|null = null;
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  static from_obj(obj: { id: number|null, name: string }): Timeline {
    const self = new Timeline(obj.name);
    self.id = obj.id;
    return self;
  }

  public to_obj(): { id: number|null, name: string } {
    return { id: this.id, name: this.name };
  }

  static async select(conx: SupabaseClient, id: number): Promise<Timeline|null> {
    const { data, error } = await conx
      .from("timelines")
      .select("id, name")
      .eq("id", id)
      .order("id");
    if (error) { throw error as PostgrestError; }
    return data.length == 1 ? Timeline.from_obj(data[0]) : null;
  }

  static async select_all(conx: SupabaseClient): Promise<Timeline[]> {
    const { data, error } = await conx
      .from("timelines")
      .select("id, name")
      .order("id");
    if (error) { throw error as PostgrestError; }
    return data.map(Timeline.from_obj);
  }

  async insert(conx: SupabaseClient): Promise<this> {
    const { data, error } = await conx.from("timelines").insert(
      {
        name: this.name,
      }).select("id");
    if (error) { throw error as PostgrestError; }
    this.id = data[0].id;
    return this;
  }

  async update(conx: SupabaseClient) {
    const { error } = await conx.from("timelines").update({
      name: this.name,
    }).eq("id", this.id);
    if (error) { throw error as PostgrestError; }
    return this;
  }

  async delete(conx: SupabaseClient) {
    const { error } = await conx
      .from("timelines")
      .delete()
      .eq("id", this.id);
    if (error) { throw error as PostgrestError; }
  }

  /**
   * Determines if item is present in the remote table, or if not, it is local.
   */
  public get in_table(): boolean { return this.id != null; }
}


// note: temporary fix until function signature changes are final and refactored elsewhere
const DEFAULT_TIMELINE: Timeline = Timeline.from_obj({ id: 1, name: "NOTL" });
