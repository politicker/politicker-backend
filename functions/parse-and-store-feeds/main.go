// Package p contains a Pub/Sub Cloud Function.
package p

import (
	"context"
	"fmt"
	"io"
	"log"
	"strings"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/mmcdole/gofeed/rss"
	"google.golang.org/api/iterator"

	"cloud.google.com/go/storage"
)

// PubSubMessage is the payload of a Pub/Sub event. Please refer to the docs for
// additional information regarding Pub/Sub events.
type PubSubMessage struct {
	Data []byte `json:"data"`
}

// FeedMeta is the metadata about a feed. It's the schema for the `feeds` collection in the DB
type FeedMeta struct {
	Name string
	URL  string
}

// FeedItem represents an item from an imported RSS feed with some additional metadata of our own
type FeedItem struct {
	Author        string
	Comments      string
	Content       string
	Description   string
	GUID          rss.GUID
	Link          string
	PubDate       string
	PubDateParsed *time.Time
	Source        *rss.Source
	Title         string
	FeedName      string
}

type feedStatus struct {
	mostRecentlyImported string
}

// ParseAndStoreFeeds consumes a Pub/Sub message.
func ParseAndStoreFeeds(ctx context.Context, _ PubSubMessage) error {
	client := createDBClient(ctx)
	feedIterator := client.Collection("feeds").Documents(ctx)

	for {
		doc, err := feedIterator.Next()

		if err == iterator.Done {
			break
		}

		if err != nil {
			log.Println("error iterating through feeds")
			return err
		}

		var feed FeedMeta
		doc.DataTo(&feed)

		statusKey := strings.ReplaceAll(feed.Name, "/", "_")
		doc, err = client.Collection("feed-status").Doc(statusKey).Get(ctx)
		var fs feedStatus
		doc.DataTo(&fs)

		objectQuery := storage.Query{
			Prefix:      feed.Name,
			StartOffset: fs.mostRecentlyImported,
		}

		client, err := storage.NewClient(ctx)
		if err != nil {
			log.Println("error creating storage client")
			return err
		}

		bucket := client.Bucket("politicker-feed-uploads")
		it := bucket.Objects(ctx, &objectQuery)

		for {
			attrs, err := it.Next()

			if err == iterator.Done {
				break
			}

			if err != nil {
				return err
			}

			// attrs.Name
			log.Println("processing object", attrs.Name)

			reader, err := bucket.Object(attrs.Name).NewReader(ctx)
			if err != nil {
				return err
			}

			if err = handleFeed(ctx, reader, feed); err != nil {
				return err
			}
		}
	}

	return nil
}

func handleFeed(ctx context.Context, reader io.Reader, feed FeedMeta) error {
	var fp rss.Parser

	feedData, err := fp.Parse(reader)
	if err != nil {
		return err
	}

	if len(feedData.Items) == 0 {
		log.Println("no data in feed")
		return nil
	}

	fmt.Println(feedData.Description)

	for _, item := range feedData.Items {
		handleFeedItem(ctx, item, feed)
	}

	return nil
}

func handleFeedItem(ctx context.Context, item *rss.Item, feed FeedMeta) error {
	client := createDBClient(ctx)
	fi := FeedItem{
		Author:        item.Author,
		Comments:      item.Comments,
		Content:       item.Content,
		Description:   item.Description,
		GUID:          *item.GUID,
		Link:          item.Link,
		PubDate:       item.PubDate,
		PubDateParsed: item.PubDateParsed,
		Source:        item.Source,
		Title:         item.Title,
		FeedName:      feed.Name,
	}

	doc := client.Collection("feed-items").Doc(fi.GUID.Value)
	if _, err := doc.Set(ctx, fi); err != nil {
		log.Println("error writing feed item to DB", fi.FeedName, fi.Title)
		return err
	}

	return nil
}

func createDBClient(ctx context.Context) *firestore.Client {
	projectID := "politicker"

	client, err := firestore.NewClient(ctx, projectID)
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}

	return client
}
