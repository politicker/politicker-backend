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

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO politicker;
