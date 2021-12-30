package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"cloud.google.com/go/firestore"
	"github.com/aws/aws-lambda-go/lambda"
)

// Response is a response
type Response struct {
	Results []struct {
		NumResults int    `json:"num_results"`
		Offset     int    `json:"offset"`
		Bills      []Bill `json:"bills"`
	} `json:"results"`
}

// Bill is a bill
type Bill struct {
	ID                    string   `json:"bill_id"`
	Type                  string   `json:"bill_type"`
	Number                string   `json:"number"`
	URI                   string   `json:"bill_uri"`
	Title                 string   `json:"title"`
	ShortTitle            string   `json:"short_title"`
	SponsorTitle          string   `json:"sponsor_title"`
	SponsorID             string   `json:"sponsor_id"`
	SponsorName           string   `json:"sponsor_name"`
	SponsorState          string   `json:"sponsor_state"`
	SponsorParty          string   `json:"sponsor_party"`
	SponsorURI            string   `json:"sponsor_uri"`
	GpoPdfURI             string   `json:"gpo_pdf_uri"`
	CongressdotgovURL     string   `json:"congressdotgov_url"`
	GovtrackURL           string   `json:"govtrack_url"`
	IntroducedDate        string   `json:"introduced_date"`
	Active                bool     `json:"active"`
	HousePassage          string   `json:"house_passage"`
	SenatePassage         string   `json:"senate_passage"`
	Enacted               string   `json:"enacted"`
	Vetoed                string   `json:"vetoed"`
	Cosponsors            int      `json:"cosponsors"`
	Committees            string   `json:"committees"`
	CommitteeCodes        []string `json:"committee_codes"`
	SubcommitteeCodes     []string `json:"subcommittee_codes"`
	PrimarySubject        string   `json:"primary_subject"`
	Summary               string   `json:"summary"`
	SummaryShort          string   `json:"summary_short"`
	LatestMajorActionDate string   `json:"latest_major_action_date"`
	LatestMajorAction     string   `json:"latest_major_action"`
}

// PubSubMessage is the payload of a Pub/Sub event. Please refer to the docs for
// additional information regarding Pub/Sub events.
type PubSubMessage struct {
	Data []byte `json:"data"`
}

// Handler handles pub subs
func handler(ctx context.Context, _ PubSubMessage) error {
	chambers := []string{"house", "senate"}
	types := []string{"introduced", "updated", "active", "passed", "enacted", "vetoed"}
	congress := "117"

	for _, chamber := range chambers {
		for _, billStatus := range types {
			url := fmt.Sprintf("https://api.propublica.org/congress/v1/%s/%s/bills/%s.json", congress, chamber, billStatus)

			var resp Response
			err := fetchJSON(url, &resp)
			if err != nil {
				log.Println("failed to fetch json from propublica API ", err)
				return err
			}

			db, err := createDBClient(ctx)
			if err != nil {
				log.Println("failed to create firestore client ", err)
				return err
			}

			collection := db.Collection("bills")
			err = saveCollection(ctx, collection, resp.Results[0].Bills)
			if err != nil {
				log.Println("failed to save collection ", err)
				return err
			}
		}
	}

	return nil
}

func fetchJSON(url string, data *Response) error {
	client := &http.Client{}
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("X-API-Key", os.Getenv("PROPUBLICA_API_KEY"))
	req.Header.Set("Content-Type", "application/json")
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode > 250 {
		return fmt.Errorf("error from API - status: %d", resp.StatusCode)
	}

	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		return err
	}

	return nil
}

func createDBClient(ctx context.Context) (*firestore.Client, error) {
	projectID := "politicker"

	client, err := firestore.NewClient(ctx, projectID)
	if err != nil {
		return nil, err
	}

	return client, nil
}

func saveCollection(ctx context.Context, collection *firestore.CollectionRef, bills []Bill) error {
	for _, bill := range bills {
		doc := collection.Doc(bill.ID)
		if _, err := doc.Set(ctx, bill); err != nil {
			return err
		}
	}
	return nil
}

func main() {
	// Make the handler available for Remote Procedure Call by AWS Lambda
	lambda.Start(handler)
}
