module github.com/politicker/politicker-backend/functions

go 1.14

require github.com/politicker/politicker-backend/functions/parse-and-store-feeds v0.0.0

require github.com/politicker/politicker-backend/functions/propublica v0.0.0

replace github.com/politicker/politicker-backend/functions/import-feeds => ./import-feeds

replace github.com/politicker/politicker-backend/functions/parse-and-store-feeds => ./parse-and-store-feeds

replace github.com/politicker/politicker-backend/functions/propublica => ./propublica
