.PHONY: build build-web generate-web build-embed serve-embed test lint migrate migrate-down seed generate clean

# Development environment: use `devctl up` instead of `make dev`.
# See: pyxis help pyxis-devctl-setup

BINARY_NAME=pyxis
GO=go
DOCKER_COMPOSE?=docker compose

build:
	$(GO) build -o bin/$(BINARY_NAME) ./cmd/pyxis

build-web:
	$(GO) run ./cmd/build-web

generate-web:
	$(GO) generate ./internal/web

build-embed: build-web
	$(GO) build -tags embed -o bin/$(BINARY_NAME) ./cmd/pyxis

serve-embed: build-web
	$(GO) run -tags embed ./cmd/pyxis serve --bind :8080

test:
	$(GO) test ./... -count=1

lint:
	golangci-lint run ./...

migrate:
	$(GO) run ./cmd/pyxis migrate up

migrate-down:
	$(GO) run ./cmd/pyxis migrate down

seed:
	$(GO) run ./cmd/pyxis seed --fixtures fixtures/dev.sql

generate:
	# Generate sqlc code
	sqlc generate
	# Generate protobuf code
	buf generate

clean:
	$(DOCKER_COMPOSE) down -v
	rm -rf bin/
