alter table public.timelines
  add column if not exists sort int not null;
