set dotenv-load := true

# terraform plan
plan:
	cd terraform && terraform plan

# deploy a named lambda
publish function:
	#!/usr/bin/env bash
	set -euxo pipefail

	just \
		--working-directory functions/{{ function }} \
		--justfile ./functions.justfile \
		build package upload-cmd

# initialize a named lambda. Should be run only once
create function:
	#!/usr/bin/env bash
	set -euxo pipefail

	just \
		--working-directory functions/{{ function }} \
		--justfile ./functions.justfile \
		build package create-cmd cleanup

dev:
	cd api && yarn dev

serve:
	cd api && yarn start

migrate:
	cd api && yarn knex migrate:latest

rollback:
	cd api && yarn knex migrate:rollback

docker:
	#!/usr/bin/env bash
	set -euxo pipefail

	cd api
	docker build -t politicker/graphql-api:latest .
	docker push politicker/graphql-api:latest

deploy:
	#!/usr/bin/env bash
	set -euxo pipefail

	TASK_DEFINITION=$(aws ecs describe-task-definition --task-definition politicker-graphql-api --region us-east-2)

	echo $TASK_DEFINITION | jq

run-nyc:
	#!/usr/bin/env bash
	set -euxo pipefail

	cd functions/politicker-nyc
	docker run -v $(pwd):/app --rm golang sh -c 'cd /app && go build main.go'
	sam local invoke -t sam-template.yaml --env-vars ../../.env.json

runl:
	#!/usr/bin/env bash
	set -euxo pipefail

	cd functions/politicker-nyc
	go run main.go
