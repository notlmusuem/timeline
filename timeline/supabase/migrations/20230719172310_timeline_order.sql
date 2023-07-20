alter table public.timeline
  add column if not exists sort int not null;
