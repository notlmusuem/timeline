create table
public.inquiries (
  id bigint generated by default as identity not null,
  submitter_name text null,
  email text null,
  phone numeric null,
  inquiry_type text null,
  message text null,
  created_at timestamp with time zone null default (now() at time zone 'edt'::text),
  constraint inquiries_pkey primary key (id)
) tablespace pg_default;
