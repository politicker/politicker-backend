DROP TABLE IF EXISTS nyc_council_raw_data;

CREATE TABLE IF NOT EXISTS nyc_council_raw_data(
	MatterID                 INTEGER,
	MatterGUID               TEXT PRIMARY KEY,
	MatterLastModifiedUtc    TEXT,
	MatterRowVersion         TEXT,
	MatterFile               TEXT,
	MatterName               TEXT,
	MatterTitle              TEXT,
	MatterTypeID             INTEGER,
	MatterTypeName           TEXT,
	MatterStatusID           INTEGER,
	MatterStatusName         TEXT,
	MatterBodyID             INTEGER,
	MatterBodyName           TEXT,
	MatterIntroDate          TEXT,
	MatterAgendaDate         TEXT,
	MatterPassedDate         TEXT,
	MatterEnactmentDate      TEXT,
	MatterEnactmentNumber    TEXT,
	MatterRequester          TEXT,
	MatterNotes              TEXT,
	MatterVersion            TEXT,
	MatterText1              TEXT,
	MatterText2              TEXT,
	MatterText3              TEXT,
	MatterText4              TEXT,
	MatterText5              TEXT,
	MatterDate1              TEXT,
	MatterDate2              TEXT,
	MatterEXText1            TEXT,
	MatterEXText2            TEXT,
	MatterEXText3            TEXT,
	MatterEXText4            TEXT,
	MatterEXText5            TEXT,
	MatterEXText6            TEXT,
	MatterEXText7            TEXT,
	MatterEXText8            TEXT,
	MatterEXText9            TEXT,
	MatterEXText10           TEXT,
	MatterEXText11           TEXT,
	MatterEXDate1            TEXT,
	MatterEXDate2            TEXT,
	MatterEXDate3            TEXT,
	MatterEXDate4            TEXT,
	MatterEXDate5            TEXT,
	MatterEXDate6            TEXT,
	MatterEXDate7            TEXT,
	MatterEXDate8            TEXT,
	MatterEXDate9            TEXT,
	MatterEXDate10           TEXT,
	MatterAgiloftID          INTEGER,
	MatterReference          TEXT,
	MatterRestrictViewViaWeb BOOLEAN
);

DROP TABLE IF EXISTS nyc_council_raw_data_diff;

CREATE TABLE IF NOT EXISTS nyc_council_raw_data_diff(
	updated_at_timestamp     TIMESTAMP,
	MatterID                 INTEGER,
	MatterGUID               TEXT,
	MatterLastModifiedUtc    TEXT,
	MatterRowVersion         TEXT,
	MatterFile               TEXT,
	MatterName               TEXT,
	MatterTitle              TEXT,
	MatterTypeID             INTEGER,
	MatterTypeName           TEXT,
	MatterStatusID           INTEGER,
	MatterStatusName         TEXT,
	MatterBodyID             INTEGER,
	MatterBodyName           TEXT,
	MatterIntroDate          TEXT,
	MatterAgendaDate         TEXT,
	MatterPassedDate         TEXT,
	MatterEnactmentDate      TEXT,
	MatterEnactmentNumber    TEXT,
	MatterRequester          TEXT,
	MatterNotes              TEXT,
	MatterVersion            TEXT,
	MatterText1              TEXT,
	MatterText2              TEXT,
	MatterText3              TEXT,
	MatterText4              TEXT,
	MatterText5              TEXT,
	MatterDate1              TEXT,
	MatterDate2              TEXT,
	MatterEXText1            TEXT,
	MatterEXText2            TEXT,
	MatterEXText3            TEXT,
	MatterEXText4            TEXT,
	MatterEXText5            TEXT,
	MatterEXText6            TEXT,
	MatterEXText7            TEXT,
	MatterEXText8            TEXT,
	MatterEXText9            TEXT,
	MatterEXText10           TEXT,
	MatterEXText11           TEXT,
	MatterEXDate1            TEXT,
	MatterEXDate2            TEXT,
	MatterEXDate3            TEXT,
	MatterEXDate4            TEXT,
	MatterEXDate5            TEXT,
	MatterEXDate6            TEXT,
	MatterEXDate7            TEXT,
	MatterEXDate8            TEXT,
	MatterEXDate9            TEXT,
	MatterEXDate10           TEXT,
	MatterAgiloftID          INTEGER,
	MatterReference          TEXT,
	MatterRestrictViewViaWeb BOOLEAN
);

CREATE TYPE public.agenda_status AS ENUM (
	'Enacted',
	'Committee',
	'Withdrawn',
	'Approved',
	'Disapproved',
	'Failed',
	'Adopted',
	'Special',
	'Local',
	'Hearing',
	'Filed',
	'General', -- orders calendar
	'Received'
);

CREATE TABLE IF NOT EXISTS public.nyc_council_matters (
	id serial primary key,
	short_description text,
	long_description text,
	bill_would text, -- give this a better name
	file_number varchar,
	type_name varchar,
	status agenda_status,
	committee_name text,
	last_modified_at timestamp,
	introduced_at date,
	passed_at date,
	enacted_at date,
	agenda_date date,
	enactment_number varchar,
	nyc_legislature_guid text,
	updated_at timestamp
);

CREATE OR REPLACE FUNCTION store_row_diff_on_change()
RETURNS trigger
AS $$ begin
	if (NEW IS DISTINCT FROM OLD) then
		INSERT INTO nyc_council_raw_data_diff VALUES(
			NOW(),
			NEW.MatterID,
			NEW.MatterGUID,
			NEW.MatterLastModifiedUtc,
			NEW.MatterRowVersion,
			NEW.MatterFile,
			NEW.MatterName,
			NEW.MatterTitle,
			NEW.MatterTypeID,
			NEW.MatterTypeName,
			NEW.MatterStatusID,
			NEW.MatterStatusName,
			NEW.MatterBodyID,
			NEW.MatterBodyName,
			NEW.MatterIntroDate,
			NEW.MatterAgendaDate,
			NEW.MatterPassedDate,
			NEW.MatterEnactmentDate,
			NEW.MatterEnactmentNumber,
			NEW.MatterRequester,
			NEW.MatterNotes,
			NEW.MatterVersion,
			NEW.MatterText1,
			NEW.MatterText2,
			NEW.MatterText3,
			NEW.MatterText4,
			NEW.MatterText5,
			NEW.MatterDate1,
			NEW.MatterDate2,
			NEW.MatterEXText1,
			NEW.MatterEXText2,
			NEW.MatterEXText3,
			NEW.MatterEXText4,
			NEW.MatterEXText5,
			NEW.MatterEXText6,
			NEW.MatterEXText7,
			NEW.MatterEXText8,
			NEW.MatterEXText9,
			NEW.MatterEXText10,
			NEW.MatterEXText11,
			NEW.MatterEXDate1,
			NEW.MatterEXDate2,
			NEW.MatterEXDate3,
			NEW.MatterEXDate4,
			NEW.MatterEXDate5,
			NEW.MatterEXDate6,
			NEW.MatterEXDate7,
			NEW.MatterEXDate8,
			NEW.MatterEXDate9,
			NEW.MatterEXDate10,
			NEW.MatterAgiloftID,
			NEW.MatterReference,
			NEW.MatterRestrictViewViaWeb
		);
	end if;
	RETURN NULL;
end;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS store_row_diff_on_change_trigger ON nyc_council_raw_data;
DROP TRIGGER IF EXISTS store_row_diff_on_change_trigger_on_create ON nyc_council_raw_data;

CREATE TRIGGER store_row_diff_on_change_trigger
	BEFORE UPDATE ON nyc_council_raw_data FOR EACH ROW
	EXECUTE FUNCTION store_row_diff_on_change();

CREATE TRIGGER store_row_diff_on_change_trigger_on_create
	BEFORE INSERT ON nyc_council_raw_data FOR EACH ROW
	EXECUTE FUNCTION store_row_diff_on_change();

CREATE OR REPLACE FUNCTION clean_data()
RETURNS trigger
AS $$ begin
	INSERT INTO nyc_council_matters (
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
		enactment_number,
		nyc_legislature_guid
	) VALUES (
		NEW.mattername,
		NEW.mattertitle,
		NEW.mattertext5,
		NEW.matterfile,
		NEW.mattertypename,
		REGEXP_REPLACE(NEW.matterstatusname, '^(\w+)(.*)', '\1')::agenda_status, -- TODO: 'General Orders Calendar' gets imported as 'General' because I'm bad at regex
		NEW.matterbodyname,
		CASE WHEN NEW.matterlastmodifiedutc = '' THEN NULL ELSE NEW.matterlastmodifiedutc::timestamp END,
		CASE WHEN NEW.matterintrodate = '' THEN NULL ELSE NEW.matterintrodate::date END,
		CASE WHEN NEW.matterpasseddate = '' THEN NULL ELSE NEW.matterpasseddate::date END,
		CASE WHEN NEW.matterenactmentdate = '' THEN NULL ELSE NEW.matterenactmentdate::date END,
		CASE WHEN NEW.matteragendadate = '' THEN NULL ELSE NEW.matteragendadate::date END,
		NEW.matterenactmentnumber,
		NEW.matterguid
	);
	RETURN NULL;
end;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clean_raw_data_after_import
	AFTER INSERT ON nyc_council_raw_data_diff FOR EACH ROW
	EXECUTE FUNCTION clean_data();

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO politicker;
