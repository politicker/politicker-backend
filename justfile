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
