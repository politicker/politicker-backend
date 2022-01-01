package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/pkg/errors"

	// sq "github.com/Masterminds/squirrel"
	_ "github.com/jackc/pgx/v4/stdlib"
)

// Response is a response
// type Response struct {
// 		MatterTitle string `json:"MatterTitle"`
// 		// Offset     int    `json:"offset"`
// 		// Bills      []Bill `json:"bills"`
// 	}
// }

// Bill is a bill
// type Bill struct {
// 	ID                    string   `json:"bill_id"`
// 	Type                  string   `json:"bill_type"`
// 	Number                string   `json:"number"`
// 	URI                   string   `json:"bill_uri"`
// 	Title                 string   `json:"title"`
// 	ShortTitle            string   `json:"short_title"`
// 	SponsorTitle          string   `json:"sponsor_title"`
// 	SponsorID             string   `json:"sponsor_id"`
// 	SponsorName           string   `json:"sponsor_name"`
// 	SponsorState          string   `json:"sponsor_state"`
// 	SponsorParty          string   `json:"sponsor_party"`
// 	SponsorURI            string   `json:"sponsor_uri"`
// 	GpoPdfURI             string   `json:"gpo_pdf_uri"`
// 	CongressdotgovURL     string   `json:"congressdotgov_url"`
// 	GovtrackURL           string   `json:"govtrack_url"`
// 	IntroducedDate        string   `json:"introduced_date"`
// 	Active                bool     `json:"active"`
// 	HousePassage          string   `json:"house_passage"`
// 	SenatePassage         string   `json:"senate_passage"`
// 	Enacted               string   `json:"enacted"`
// 	Vetoed                string   `json:"vetoed"`
// 	Cosponsors            int      `json:"cosponsors"`
// 	Committees            string   `json:"committees"`
// 	CommitteeCodes        []string `json:"committee_codes"`
// 	SubcommitteeCodes     []string `json:"subcommittee_codes"`
// 	PrimarySubject        string   `json:"primary_subject"`
// 	Summary               string   `json:"summary"`
// 	SummaryShort          string   `json:"summary_short"`
// 	LatestMajorActionDate string   `json:"latest_major_action_date"`
// 	LatestMajorAction     string   `json:"latest_major_action"`
// }

type Matter struct {
	MatterID                 int    `json:"MatterId"`
	MatterGUID               string `json:"MatterGuid"`
	MatterLastModifiedUtc    string `json:"MatterLastModifiedUtc"`
	MatterRowVersion         string `json:"MatterRowVersion"`
	MatterFile               string `json:"MatterFile"`
	MatterName               string `json:"MatterName"`
	MatterTitle              string `json:"MatterTitle"`
	MatterTypeID             int    `json:"MatterTypeId"`
	MatterTypeName           string `json:"MatterTypeName"`
	MatterStatusID           int    `json:"MatterStatusId"`
	MatterStatusName         string `json:"MatterStatusName"`
	MatterBodyID             int    `json:"MatterBodyId"`
	MatterBodyName           string `json:"MatterBodyName"`
	MatterIntroDate          string `json:"MatterIntroDate"`
	MatterAgendaDate         string `json:"MatterAgendaDate"`
	MatterPassedDate         string `json:"MatterPassedDate"`
	MatterEnactmentDate      string `json:"MatterEnactmentDate"`
	MatterEnactmentNumber    string `json:"MatterEnactmentNumber"`
	MatterRequester          string `json:"MatterRequester"`
	MatterNotes              string `json:"MatterNotes"`
	MatterVersion            string `json:"MatterVersion"`
	MatterText1              string `json:"MatterText1"`
	MatterText2              string `json:"MatterText2"`
	MatterText3              string `json:"MatterText3"`
	MatterText4              string `json:"MatterText4"`
	MatterText5              string `json:"MatterText5"`
	MatterDate1              string `json:"MatterDate1"`
	MatterDate2              string `json:"MatterDate2"`
	MatterEXText1            string `json:"MatterEXText1"`
	MatterEXText2            string `json:"MatterEXText2"`
	MatterEXText3            string `json:"MatterEXText3"`
	MatterEXText4            string `json:"MatterEXText4"`
	MatterEXText5            string `json:"MatterEXText5"`
	MatterEXText6            string `json:"MatterEXText6"`
	MatterEXText7            string `json:"MatterEXText7"`
	MatterEXText8            string `json:"MatterEXText8"`
	MatterEXText9            string `json:"MatterEXText9"`
	MatterEXText10           string `json:"MatterEXText10"`
	MatterEXText11           string `json:"MatterEXText11"`
	MatterEXDate1            string `json:"MatterEXDate1"`
	MatterEXDate2            string `json:"MatterEXDate2"`
	MatterEXDate3            string `json:"MatterEXDate3"`
	MatterEXDate4            string `json:"MatterEXDate4"`
	MatterEXDate5            string `json:"MatterEXDate5"`
	MatterEXDate6            string `json:"MatterEXDate6"`
	MatterEXDate7            string `json:"MatterEXDate7"`
	MatterEXDate8            string `json:"MatterEXDate8"`
	MatterEXDate9            string `json:"MatterEXDate9"`
	MatterEXDate10           string `json:"MatterEXDate10"`
	MatterAgiloftID          int    `json:"MatterAgiloftId"`
	MatterReference          string `json:"MatterReference"`
	MatterRestrictViewViaWeb bool   `json:"MatterRestrictViewViaWeb"`
	// MatterReports            []string `json:"MatterReports"`
}

// PubSubMessage is the payload of a Pub/Sub event. Please refer to the docs for
// additional information regarding Pub/Sub events.
type PubSubMessage struct {
	Data []byte `json:"data"`
}

var token string
var dburl string

func init() {
	token = os.Getenv("NYC_TOKEN")

	if token == "" {
		log.Panicln("missing env NYC_TOKEN")
	}

	dburl = os.Getenv("DATABASE_URL")

	if dburl == "" {
		log.Panicln("missing env DATABASE_URL")
	}
}

// Handler handles pub subs
func handler(ctx context.Context) error {
	db, err := createDBClient(ctx)

	if err != nil {
		return errors.Wrap(err, "failed to create db client")
	}

	if _, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS import_cursors(
			key text not null PRIMARY KEY,
			value integer
		)
	`); err != nil {
		return errors.Wrap(err, "failed to create import_cursors table")
	}

	rows, err := db.Query(`SELECT COALESCE((SELECT value FROM import_cursors WHERE key = 'nyc_council_offset' LIMIT 1), 0)`)
	if err != nil {
		return errors.Wrap(err, "failed to get current offset")
	}

	limit := 500
	offset := 0

	rows.Next()

	// if err := rows.Scan(&offset); err != nil {
	// 	return errors.Wrap(err, "failed to scan")
	// }

	// if err := rows.Close(); err != nil {
	// 	return errors.Wrap(err, "failed to close query")
	// }

	for {
		url := fmt.Sprintf("https://webapi.legistar.com/v1/nyc/matters?$skip=%d&$top=%d&token=%s", offset, limit, token)
		log.Println(url)
		resp := []Matter{}

		err := fetchJSON(url, &resp)
		if err != nil {
			return errors.Wrap(err, "failed to fetch json from Legistar")
		}

		log.Println("items in response ", len(resp))

		if len(resp) == 0 {
			break
		}

		tx, err := db.BeginTx(ctx, nil)
		if err != nil {
			return errors.Wrap(err, "failed to begin tx")
		}

		if err := insertRows(resp, tx); err != nil {
			return errors.Wrap(err, "failed to insert rows")
		}

		offset = offset + limit

		// if _, err := tx.Exec(`
		// 	INSERT INTO import_cursors (key, value)
		// 	VALUES('nyc_council_offset', $1)
		// 	ON CONFLICT (key)
		// 	DO
		// 		UPDATE SET value = $1;
		// `, offset); err != nil {
		// 	return errors.Wrap(err, "failed to save current offset")
		// }

		if err = tx.Commit(); err != nil {
			return errors.Wrap(err, "failed to commit tx")
		}
	}

	return nil
}

func insertRows(resp []Matter, tx *sql.Tx) error {
	// psql := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)

	// builder := psql.
	// 	Insert("nyc_council_raw_data").
	// 	Columns(
	// 		"MatterID",
	// 		"MatterGUID",
	// 		"MatterLastModifiedUtc",
	// 		"MatterRowVersion",
	// 		"MatterFile",
	// 		"MatterName",
	// 		"MatterTitle",
	// 		"MatterTypeID",
	// 		"MatterTypeName",
	// 		"MatterStatusID",
	// 		"MatterStatusName",
	// 		"MatterBodyID",
	// 		"MatterBodyName",
	// 		"MatterIntroDate",
	// 		"MatterAgendaDate",
	// 		"MatterPassedDate",
	// 		"MatterEnactmentDate",
	// 		"MatterEnactmentNumber",
	// 		"MatterRequester",
	// 		"MatterNotes",
	// 		"MatterVersion",
	// 		"MatterText1",
	// 		"MatterText2",
	// 		"MatterText3",
	// 		"MatterText4",
	// 		"MatterText5",
	// 		"MatterDate1",
	// 		"MatterDate2",
	// 		"MatterEXText1",
	// 		"MatterEXText2",
	// 		"MatterEXText3",
	// 		"MatterEXText4",
	// 		"MatterEXText5",
	// 		"MatterEXText6",
	// 		"MatterEXText7",
	// 		"MatterEXText8",
	// 		"MatterEXText9",
	// 		"MatterEXText10",
	// 		"MatterEXText11",
	// 		"MatterEXDate1",
	// 		"MatterEXDate2",
	// 		"MatterEXDate3",
	// 		"MatterEXDate4",
	// 		"MatterEXDate5",
	// 		"MatterEXDate6",
	// 		"MatterEXDate7",
	// 		"MatterEXDate8",
	// 		"MatterEXDate9",
	// 		"MatterEXDate10",
	// 		"MatterAgiloftID",
	// 		"MatterReference",
	// 		"MatterRestrictViewViaWeb",
	// 	)

	for _, matter := range resp {
		log.Println(matter.MatterGUID)

		if _, err := tx.Exec(`
			INSERT INTO nyc_council_raw_data VALUES(
				$1,
				$2,
				$3,
				$4,
				$5,
				$6,
				$7,
				$8,
				$9,
				$10,
				$11,
				$12,
				$13,
				$14,
				$15,
				$16,
				$17,
				$18,
				$19,
				$20,
				$21,
				$22,
				$23,
				$24,
				$25,
				$26,
				$27,
				$28,
				$29,
				$30,
				$31,
				$32,
				$33,
				$34,
				$35,
				$36,
				$37,
				$38,
				$39,
				$40,
				$41,
				$42,
				$43,
				$44,
				$45,
				$46,
				$47,
				$48,
				$49,
				$50,
				$51,
				$52
			)
			ON CONFLICT (MatterGUID) DO
			UPDATE SET
				MatterID = $1,
				MatterGUID = $2,
				MatterLastModifiedUtc = $3,
				MatterRowVersion = $4,
				MatterFile = $5,
				MatterName = $6,
				MatterTitle = $7,
				MatterTypeID = $8,
				MatterTypeName = $9,
				MatterStatusID = $10,
				MatterStatusName = $11,
				MatterBodyID = $12,
				MatterBodyName = $13,
				MatterIntroDate = $14,
				MatterAgendaDate = $15,
				MatterPassedDate = $16,
				MatterEnactmentDate = $17,
				MatterEnactmentNumber = $18,
				MatterRequester = $19,
				MatterNotes = $20,
				MatterVersion = $21,
				MatterText1 = $22,
				MatterText2 = $23,
				MatterText3 = $24,
				MatterText4 = $25,
				MatterText5 = $26,
				MatterDate1 = $27,
				MatterDate2 = $28,
				MatterEXText1 = $29,
				MatterEXText2 = $30,
				MatterEXText3 = $31,
				MatterEXText4 = $32,
				MatterEXText5 = $33,
				MatterEXText6 = $34,
				MatterEXText7 = $35,
				MatterEXText8 = $36,
				MatterEXText9 = $37,
				MatterEXText10 = $38,
				MatterEXText11 = $39,
				MatterEXDate1 = $40,
				MatterEXDate2 = $41,
				MatterEXDate3 = $42,
				MatterEXDate4 = $43,
				MatterEXDate5 = $44,
				MatterEXDate6 = $45,
				MatterEXDate7 = $46,
				MatterEXDate8 = $47,
				MatterEXDate9 = $48,
				MatterEXDate10 = $49,
				MatterAgiloftID = $50,
				MatterReference = $51,
				MatterRestrictViewViaWeb = $52;
		`,
			matter.MatterID,
			matter.MatterGUID,
			matter.MatterLastModifiedUtc,
			matter.MatterRowVersion,
			matter.MatterFile,
			matter.MatterName,
			matter.MatterTitle,
			matter.MatterTypeID,
			matter.MatterTypeName,
			matter.MatterStatusID,
			matter.MatterStatusName,
			matter.MatterBodyID,
			matter.MatterBodyName,
			matter.MatterIntroDate,
			matter.MatterAgendaDate,
			matter.MatterPassedDate,
			matter.MatterEnactmentDate,
			matter.MatterEnactmentNumber,
			matter.MatterRequester,
			matter.MatterNotes,
			matter.MatterVersion,
			matter.MatterText1,
			matter.MatterText2,
			matter.MatterText3,
			matter.MatterText4,
			matter.MatterText5,
			matter.MatterDate1,
			matter.MatterDate2,
			matter.MatterEXText1,
			matter.MatterEXText2,
			matter.MatterEXText3,
			matter.MatterEXText4,
			matter.MatterEXText5,
			matter.MatterEXText6,
			matter.MatterEXText7,
			matter.MatterEXText8,
			matter.MatterEXText9,
			matter.MatterEXText10,
			matter.MatterEXText11,
			matter.MatterEXDate1,
			matter.MatterEXDate2,
			matter.MatterEXDate3,
			matter.MatterEXDate4,
			matter.MatterEXDate5,
			matter.MatterEXDate6,
			matter.MatterEXDate7,
			matter.MatterEXDate8,
			matter.MatterEXDate9,
			matter.MatterEXDate10,
			matter.MatterAgiloftID,
			matter.MatterReference,
			matter.MatterRestrictViewViaWeb,
		); err != nil {
			return errors.Wrap(err, "failed to insert row")
		}
	}

	// sql, args, err := builder.ToSql()
	// if err != nil {
	// 	log.Println("failed to build sql prepared statement ", err)
	// 	return err
	// }

	// if _, err := tx.Exec(sql, args...); err != nil {
	// 	log.Println("failed to execute query ", err)
	// 	return err
	// }

	return nil
}

func fetchJSON(url string, data *[]Matter) error {
	client := &http.Client{}
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Content-Type", "application/json")
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode > 250 {
		return fmt.Errorf("error from API - status: %d", resp.StatusCode)
	}

	bytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	fmt.Println(resp.Header)

	err = json.Unmarshal(bytes, &data)
	if err != nil {
		return err
	}

	return nil
}

func createDBClient(ctx context.Context) (*sql.DB, error) {
	db, err := sql.Open("pgx", dburl)
	if err != nil {
		return nil, err
	}

	return db, nil
}

func main() {
	// Make the handler available for Remote Procedure Call by AWS Lambda
	// lambda.Start(handler)
	ctx := context.Background()
	if err := handler(ctx); err != nil {
		log.Println(err)
	}
}
