insert into public.timeline (start_date, end_date, start_date_precision, end_date_precision, title) values ('1615-01-01', '1616-01-01', 'year', 'year', 'Etienne Brule visits the Attiwondaron');
insert into public.timeline (start_date, end_date, start_date_precision, end_date_precision, title) values ('1600-01-01', null, 'decade', null, 'Champlain coins the term “la nation neutre” in');
insert into public.timeline (start_date, end_date, start_date_precision, end_date_precision, title) values ('1626-01-01', null, 'year', null, 'Joseph de la Roche Daillon visits, and is welcomed by Neutrals');
insert into public.timeline (start_date, end_date, start_date_precision, end_date_precision, title) values ('1626-01-01', null, 'year', null, 'Joseph de la Roche Daillon visits, and is welcomed by Neutrals');
insert into public.timeline (start_date, end_date, start_date_precision, end_date_precision, title) values ('1626-01-01', null, 'year', null, 'Joseph de la Roche Daillon visits, and is welcomed by Neutrals');

/* playing with image credit column */
UPDATE public.timeline
SET image_credit = 'https://global-uploads.webflow.com/5b44edefca321a1e2d0c2aa6/5e70a7b2bf3d8e14c28562f5_Dimensions-Guide-Digital-Microsoft-Surface-Computers-Microsoft-Surface-Pro-7-OG.jpg'
WHERE id = 1;
