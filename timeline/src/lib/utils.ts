import { UTCDate } from "@date-fns/utc";
import * as datefn from "date-fns-tz";


export function validateEmail(email: string): boolean {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

export function validatePhone(phone: string): boolean {
  const re = /^(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  return re.test(phone);
}


export function strip(str: string, strip: string): string {
  return strip_end(strip_start(str, strip), strip);
}

export function strip_start(str: string, strip: string): string {
  return str.startsWith(strip) ? str.substring(strip.length) : str;
}

export function strip_end(str: string, strip: string): string {
  return str.endsWith(strip)
    ? str.substring(0, str.length - strip.length) : str;
}


/**
 * Performs a structuredClone on an object, but also copies over the prototype
 * by reference. This is important when cloning class instances.
 *
 * @param obj The object to clone
 * @returns The cloned object with the same prototype
 */
export function structuredCloneProto<T>(obj: T): T {
  const clone = structuredClone(obj);
  // structuredClone presently does not copy over prototypes, so we need to
  // copy them ourselves
  Object.setPrototypeOf(clone, Object.getPrototypeOf(obj));
  return clone;
}

/**
 * Sleeps for the provided time.
 */
export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Tries to parses an integer from a string or returns null otherwise.
 */
export function parseIntNull(
  str: string, radix: number|undefined = undefined
): number|null {
  const num = Number.parseInt(str, radix);
  return isNaN(num) ? null : num;
}


export function format_date(date: UTCDate, precision: "day"|"month"|"year"|"decade"): string {
  // if the date is invalid, there's no meaningful way to format it
  if (isNaN(date.getTime())) { return date.toString(); }

  switch (precision) {
    case "day": return datefn.formatInTimeZone(date, "UTC", "MMMM d, yyyy");
    case "month": return datefn.formatInTimeZone(date, "UTC", "MMMM, yyyy");
    case "year": return datefn.formatInTimeZone(date, "UTC", "yyyy");
    case "decade":
      // zero out the last year digit with an intdiv
      let zeroed = structuredCloneProto(date);
      zeroed.setFullYear(Math.floor(date.getFullYear() / 10) * 10);
      return datefn.formatInTimeZone(zeroed, "UTC", "yyyy") + "s";
  }
}

export function format_date_range(
  start_date: UTCDate, start_date_precision: "day"|"month"|"year"|"decade",
  end_date: UTCDate|null, end_date_precision: "day"|"month"|"year"|"decade"|null
): string {
  const start = format_date(start_date, start_date_precision);
  if (end_date != null && end_date_precision != null) {
    return `${start} – ${format_date(end_date, end_date_precision)}`;
  }
  return start;
}

export function format_date_numbers(
  date: UTCDate, precision: "day"|"month"|"year"|"decade"
): string {
  if (isNaN(date.getTime())) { return ""; }

  switch (precision) {
    case "day": return datefn.formatInTimeZone(date, "UTC", "yyyy-MM-dd");
    case "month": return datefn.formatInTimeZone(date, "UTC", "yyyy-MM");
    case "year": return datefn.formatInTimeZone(date, "UTC", "yyyy");
    case "decade":
      // zero out the last year digit with an intdiv
      let zeroed = structuredCloneProto(date);
      zeroed.setFullYear(Math.floor(date.getFullYear() / 10) * 10);
      return datefn.formatInTimeZone(zeroed, "UTC", "yyyy") + "s";
  }
}

export function format_date_range_numbers(
  start_date: UTCDate, start_precision: "day"|"month"|"year"|"decade",
  end_date: UTCDate|null, end_precision: "day"|"month"|"year"|"decade"|null
): string {
  const start = format_date_numbers(start_date, start_precision);
  if (end_date != null && end_precision != null) {
    return `${start} – ${format_date_numbers(end_date, end_precision)}`;
  }
  return start;
}
