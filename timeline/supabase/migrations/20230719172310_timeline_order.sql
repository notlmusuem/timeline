alter table public.timeline
  add unique column if not exists sort int not null;
