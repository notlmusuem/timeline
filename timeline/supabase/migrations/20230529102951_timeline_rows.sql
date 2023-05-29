create type public.date_precision as enum('day', 'month', 'year', 'decade');

alter table public.timeline
  add column if not exists start_date_precision date_precision default 'day' not null,
  add column if not exists end_date date null,
  add column if not exists end_date_precision date_precision default 'day',
  alter column created_at set not null,
  -- ensure that (end_date == NULL) == (end_date_precision == NULL)
  add constraint timeline_end_date_precision_null check (
    (end_date is not null and end_date_precision is not null)
    or (end_date is null and end_date_precision is null)
  );
