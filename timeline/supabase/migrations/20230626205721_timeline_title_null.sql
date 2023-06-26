-- remove nullibility from title and set it's default value appropriately
alter table public.timeline
  alter column title set default '',
  alter column title set not null;
