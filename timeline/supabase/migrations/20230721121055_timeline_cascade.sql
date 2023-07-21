alter table public.timeline
  drop constraint if exists timeline,
  add constraint timeline_timeline_fk foreign key (timeline) references public.timelines(id)
    on delete cascade on update cascade;
