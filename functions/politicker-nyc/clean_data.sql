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
