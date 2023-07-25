insert into public.timeline (start_date,title,body,image,image_credit,start_date_precision,end_date,end_date_precision,timeline,image_caption) values ('1812-01-01','War of 1812',null,null,null,'year','1814-01-01','year','1',null);
insert into public.timeline (start_date,title,body,image,image_credit,start_date_precision,end_date,end_date_precision,timeline,image_caption) values ('1812-06-01','War is declared',null,null,null,'month',null,null,'1',null);
insert into public.timeline (start_date,title,body,image,image_credit,start_date_precision,end_date,end_date_precision,timeline,image_caption) values ('1812-10-01','Captain Robert Runchey (a white Niagara tavern owner) is put in charge of the Coloured Corps',null,null,null,'month',null,null,'1',null);
insert into public.timeline (start_date,title,body,image,image_credit,start_date_precision,end_date,end_date_precision,timeline,image_caption) values ('1812-10-13','Battle of Queenston Heights',null,null,null,'day',null,null,'1',null);
insert into public.timeline (start_date,title,body,image,image_credit,start_date_precision,end_date,end_date_precision,timeline,image_caption) values ('1813-05-25','Battle of Fort George and the Town of Niagara, Queenston, St. Davids, Virgil are occupied by the American Army',null,null,null,'day','1813-05-27','day','1',null);
insert into public.timeline (start_date,title,body,image,image_credit,start_date_precision,end_date,end_date_precision,timeline,image_caption) values ('1813-06-22','Laura Secord begins her trek',null,null,null,'day',null,null,'1',null);
insert into public.timeline (start_date,title,body,image,image_credit,start_date_precision,end_date,end_date_precision,timeline,image_caption) values ('1813-07-08','Battle at Butler’s Farm',null,null,null,'day',null,null,'1',null);
insert into public.timeline (start_date,title,body,image,image_credit,start_date_precision,end_date,end_date_precision,timeline,image_caption) values ('1813-07-10','First Muster of the traitorous Canadian Volunteers',null,null,null,'day',null,null,'1',null);
insert into public.timeline (start_date,title,body,image,image_credit,start_date_precision,end_date,end_date_precision,timeline,image_caption) values ('1813-08-14','Skirmish at Ball’s Farm',null,null,null,'day',null,null,'1',null);
insert into public.timeline (start_date,title,body,image,image_credit,start_date_precision,end_date,end_date_precision,timeline,image_caption) values ('1813-12-10','Burning of Niagara, Americans abandon Fort George',null,null,null,'day',null,null,'1',null);
insert into public.timeline (start_date,title,body,image,image_credit,start_date_precision,end_date,end_date_precision,timeline,image_caption) values ('1813-12-19','Capture of Fort Niagara',null,null,null,'day',null,null,'1',null);
insert into public.timeline (start_date,title,body,image,image_credit,start_date_precision,end_date,end_date_precision,timeline,image_caption) values ('1814-07-18','Burning of St. Davids',null,null,null,'day',null,null,'1',null);
insert into public.timeline (start_date,title,body,image,image_credit,start_date_precision,end_date,end_date_precision,timeline,image_caption) values ('1814-12-24','Treaty of Ghent is signed and goes into effect on February 17, 1815',null,null,null,'day',null,null,'1',null);
insert into public.timeline (start_date,title,body,image,image_credit,start_date_precision,end_date,end_date_precision,timeline,image_caption) values ('1832-01-01','Niagara Harbour & Dock Co formed',null,null,null,'year',null,null,'1',null);


/* playing with image credit column */
UPDATE public.timeline
SET image_credit = 'https://global-uploads.webflow.com/5b44edefca321a1e2d0c2aa6/5e70a7b2bf3d8e14c28562f5_Dimensions-Guide-Digital-Microsoft-Surface-Computers-Microsoft-Surface-Pro-7-OG.jpg'
WHERE id = 1;

UPDATE public.timelines
SET sort = 1
