.PHONY: all ci build build-web generate-web build-embed serve-embed test web-check lint lintmax \
        golangci-lint-install gosec govulncheck docker-build docker-run docker-smoke \
        migrate migrate-down seed generate clean

# Development environment: use `devctl up` instead of `make dev`.
# See: pyxis help pyxis-devctl-setup

BINARY_NAME ?= pyxis
GO ?= go
DOCKER ?= docker
DOCKER_COMPOSE ?= docker compose

VERSION ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo v0.0.0-dev)
IMAGE_REPOSITORY ?= ghcr.io/wesen/pyxis
IMAGE_TAG ?= sha-$(shell git rev-parse --short HEAD 2>/dev/null || echo local)
IMAGE ?= $(IMAGE_REPOSITORY):$(IMAGE_TAG)

GOLANGCI_LINT_VERSION ?= $(shell cat .golangci-lint-version 2>/dev/null || echo v2.5.0)
GOLANGCI_LINT_BIN ?= $(CURDIR)/.bin/golangci-lint
GOLANGCI_LINT_ARGS ?= --timeout=5m ./cmd/... ./pkg/... ./internal/...

all: test build

ci: generate test web-check build-embed

build:
	$(GO) build -o bin/$(BINARY_NAME) ./cmd/pyxis

build-web:
	$(GO) run ./cmd/build-web

generate-web:
	$(GO) generate ./internal/web

build-embed: build-web
	CGO_ENABLED=1 $(GO) build -tags embed -trimpath -o bin/$(BINARY_NAME) ./cmd/pyxis

serve-embed: build-web
	$(GO) run -tags embed ./cmd/pyxis serve --bind :8080

test:
	$(GO) test ./... -count=1

web-check:
	pnpm --dir web --filter pyxis-types build
	pnpm --dir web --filter pyxis-components build
	pnpm --dir web --filter pyxis-app exec tsc --noEmit
	pnpm --dir web --filter pyxis-user-site exec tsc --noEmit
	pnpm --dir web --filter pyxis-user-site build

golangci-lint-install:
	mkdir -p $(dir $(GOLANGCI_LINT_BIN))
	GOBIN=$(dir $(GOLANGCI_LINT_BIN)) $(GO) install github.com/golangci/golangci-lint/v2/cmd/golangci-lint@$(GOLANGCI_LINT_VERSION)

lint: golangci-lint-install
	$(GOLANGCI_LINT_BIN) config verify
	$(GOLANGCI_LINT_BIN) run -v $(GOLANGCI_LINT_ARGS)

lintmax: golangci-lint-install
	$(GOLANGCI_LINT_BIN) run -v --max-same-issues=100 $(GOLANGCI_LINT_ARGS)

gosec:
	$(GO) install github.com/securego/gosec/v2/cmd/gosec@latest
	gosec -exclude-generated -exclude=G101,G304,G301,G306,G204 -exclude-dir=.history -exclude-dir=ttmp ./...

govulncheck:
	$(GO) install golang.org/x/vuln/cmd/govulncheck@latest
	govulncheck ./...

docker-build:
	$(DOCKER) build -t $(IMAGE) .

docker-run:
	$(DOCKER) run --rm -p 8080:8080 \
		-e PYXIS_DATABASE_URL=$${PYXIS_DATABASE_URL:-postgres://pyxis:pyxis@host.docker.internal:5433/pyxis?sslmode=disable} \
		-v pyxis-data:/data \
		$(IMAGE)

docker-smoke: docker-build
	$(DOCKER) run --rm $(IMAGE) --help
	$(DOCKER) run --rm $(IMAGE) serve --help

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
	rm -rf bin/ .bin/
