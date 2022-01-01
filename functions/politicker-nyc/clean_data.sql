CREATE TYPE public.agenda_status AS ENUM (
		'enacted',
    'committee',
    'withdrawn',
    'disapproved',
		'adopted',
		'filed',
		'general orders calendar',
		'received'
);

CREATE TABLE IF NOT EXISTS public.nyc_agenda_items (
	id bigint primary,
	short_description text,
	long_description text,
	bill_would text, -- give this a better name
	file_number varchar,
	type_name varchar,
	status agenda_status,
	committee_name text,
	last_modified_at datetime,
	introduced_at date,
	passed_at date,
	enacted_at date,
	agenda_date date,
	enacment_number varchar,
	nyc_legislature_guid text
);

INSERT INTO nyc_agenda_items (
	short_description,
	long_description,
	bill_would,
	file_number,
	type_name,
	status,
	committee_name,
	last_modified_at,
	introduced_at,
	passed_at,
	enacted_at,
	agenda_date,
	enacment_number,
	nyc_legislature_guid
) SELECT
		mattername,
		mattertitle,
		mattertext5,
		matterfile,
		mattertypename,
		REGEXP_REPLACE(matterstatusname, '^(\w+)(.*)', '\1'), -- TODO: 'General Orders Calendar' gets imported as 'General' because I'm bad at regex
		matterbodyname,
		matterlastmodifiedutc::timestamp,
		matterintrodate::date,
		matterpasseddate::date,
		matterenacmentdate::date,
		matteragendadate::date,
		matterenacmentnumber,
		matterguid
	FROM nyc_council_raw_data_diff;
