package main

import (
	"context"
	"log"

	// p "github.com/politicker/politicker-backend/functions/parse-and-store-feeds"
	p "github.com/politicker/politicker-backend/functions/propublica"
)

func main() {
	ctx := context.Background()
	err := p.HandlePubSub(ctx, p.PubSubMessage{})
	if err != nil {
		log.Fatal(err)
	}
}
