set dotenv-load := true

# terraform plan
plan:
	cd terraform && terraform plan
tf *args:
	cd terraform && terraform {{args}}


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

pw:
	jq -r '.values.root_module.resources[] | select(.address | contains("password")) | .values.result'

load:
	PGPASSWORD=politicker psql -U politicker -h localhost politicker-development < functions/politicker-nyc/structure.sql

get-env:
	aws s3 cp s3://politicker-secrets/production/politicker-api.env ./

put-env:
	aws s3 cp ./politicker-api.env s3://politicker-secrets/production/politicker-api.env