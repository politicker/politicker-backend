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

	sq "github.com/Masterminds/squirrel"
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
	log.Println(token)
	url := fmt.Sprintf("https://webapi.legistar.com/v1/nyc/matters?$top=500&$orderby=MatterAgendaDate%%20desc&token=%s", token)

	log.Println(url)

	resp := []Matter{}
	err := fetchJSON(url, &resp)
	if err != nil {
		log.Println("failed to fetch json from Legistar ", err)
		return err
	}

	db, err := createDBClient(ctx)
	if err != nil {
		log.Println("failed to create db client ", err)
		return err
	}

	log.Println(db)

	psql := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)

	builder := psql.
		Insert("nyc_council_raw_data").
		Columns(
			"MatterID",
			"MatterGUID",
			"MatterLastModifiedUtc",
			"MatterRowVersion",
			"MatterFile",
			"MatterName",
			"MatterTitle",
			"MatterTypeID",
			"MatterTypeName",
			"MatterStatusID",
			"MatterStatusName",
			"MatterBodyID",
			"MatterBodyName",
			"MatterIntroDate",
			"MatterAgendaDate",
			"MatterPassedDate",
			"MatterEnactmentDate",
			"MatterEnactmentNumber",
			"MatterRequester",
			"MatterNotes",
			"MatterVersion",
			"MatterText1",
			"MatterText2",
			"MatterText3",
			"MatterText4",
			"MatterText5",
			"MatterDate1",
			"MatterDate2",
			"MatterEXText1",
			"MatterEXText2",
			"MatterEXText3",
			"MatterEXText4",
			"MatterEXText5",
			"MatterEXText6",
			"MatterEXText7",
			"MatterEXText8",
			"MatterEXText9",
			"MatterEXText10",
			"MatterEXText11",
			"MatterEXDate1",
			"MatterEXDate2",
			"MatterEXDate3",
			"MatterEXDate4",
			"MatterEXDate5",
			"MatterEXDate6",
			"MatterEXDate7",
			"MatterEXDate8",
			"MatterEXDate9",
			"MatterEXDate10",
			"MatterAgiloftID",
			"MatterReference",
			"MatterRestrictViewViaWeb",
		)

	for _, matter := range resp {
		// log.Println(resp.MatterName)
		builder = builder.Values(
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
		)
	}

	sql, args, err := builder.ToSql()
	if err != nil {
		log.Println("failed to build sql prepared statement ", err)
		return err
	}

	if _, err := db.Exec(sql, args...); err != nil {
		log.Println("failed to execute query ", err)
		return err
	}

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
	handler(ctx)
}
