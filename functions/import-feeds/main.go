// Package p contains a Pub/Sub Cloud Function.
package p

import (
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"cloud.google.com/go/storage"
)

// PubSubMessage is the payload of a Pub/Sub event. Please refer to the docs for
// additional information regarding Pub/Sub events.
type PubSubMessage struct {
	Data []byte `json:"data"`
}

// Feed hey
type Feed struct {
	Name string
	URL  string
}

// HandlePubSub consumes a Pub/Sub message.
func HandlePubSub(ctx context.Context, m PubSubMessage) error {
	feeds := []Feed{
		{
			Name: "congress.gov/presented-to-president",
			URL:  "https://www.congress.gov/rss/presented-to-president.xml",
		},
		{
			Name: "congress.gov/house-floor-today",
			URL:  "https://www.congress.gov/rss/house-floor-today.xml",
		},
		{
			Name: "congress.gov/senate-floor-today",
			URL:  "https://www.congress.gov/rss/senate-floor-today.xml",
		},
	}

	client, err := storage.NewClient(ctx)
	if err != nil {
		log.Println("error creating storate client")
		return err
	}

	bucket := client.Bucket("politicker-feed-uploads")

	for _, feed := range feeds {
		timestamp := time.Now().Format(time.RFC3339)
		filename := fmt.Sprintf("%s/%s.xml", feed.Name, timestamp)

		log.Println("attempting to load bucket for", feed.Name)
		log.Println("target key is", filename)

		res, err := http.Get(feed.URL)
		if err != nil {
			log.Println(err)
			return err
		}

		body, err := ioutil.ReadAll(res.Body)
		if err != nil {
			log.Println(err)
			return err
		}

		dest := bucket.Object(filename)
		writer := dest.NewWriter(ctx)
		writer.ContentType = "text/xml; charset=utf-8"

		if _, err = writer.Write(body); err != nil {
			log.Println(err)
			return err
		}

		if err := writer.Close(); err != nil {
			log.Println(err)
			return err
		}

		log.Println("closed successfully")

		log.Println("finished loading", feed.Name)
	}

	return nil
}
