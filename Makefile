.PHONY: build build-web generate-web build-embed serve-embed test lint migrate migrate-down seed generate clean dev dev-stop dev-logs

BINARY_NAME=pyxis
GO=go
DOCKER_COMPOSE?=docker compose
TMUX=tmux
DEV_BACKEND_SESSION=pyxis-backend-dev
DEV_VITE_SESSION=pyxis-app-vite
DEV_PUBLIC_VITE_SESSION=pyxis-user-site-vite
DEV_BACKEND_BIND?=127.0.0.1:8080
DEV_VITE_HOST?=0.0.0.0
DEV_WEBSITE_URL?=http://localhost:3008
DEV_PUBLIC_SITE_URL?=http://localhost:3007
DEV_DISCORD_REDIRECT_URL?=$(DEV_WEBSITE_URL)/auth/discord/callback

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

dev:
	@command -v $(TMUX) >/dev/null || { echo "tmux is required for make dev" >&2; exit 1; }
	@command -v direnv >/dev/null || { echo "direnv is required for make dev" >&2; exit 1; }
	$(DOCKER_COMPOSE) up -d db
	@echo "Waiting for PostgreSQL to be healthy..."
	@for i in $$(seq 1 30); do \
		if $(DOCKER_COMPOSE) exec -T db pg_isready -U pyxis -d pyxis >/dev/null 2>&1; then \
			echo "PostgreSQL is healthy"; \
			break; \
		fi; \
		if [ "$$i" = "30" ]; then \
			echo "PostgreSQL did not become healthy" >&2; \
			exit 1; \
		fi; \
		sleep 1; \
	done
	@echo "Running database migrations..."
	@direnv exec . $(GO) run ./cmd/pyxis migrate up
	@$(TMUX) kill-session -t $(DEV_BACKEND_SESSION) 2>/dev/null || true
	@$(TMUX) kill-session -t $(DEV_VITE_SESSION) 2>/dev/null || true
	@$(TMUX) kill-session -t $(DEV_PUBLIC_VITE_SESSION) 2>/dev/null || true
	@echo "Starting backend in tmux session $(DEV_BACKEND_SESSION) on $(DEV_BACKEND_BIND)..."
	@$(TMUX) new-session -d -s $(DEV_BACKEND_SESSION) -c "$(CURDIR)" 'direnv exec . env PYXIS_WEBSITE_URL=$(DEV_WEBSITE_URL) PYXIS_DISCORD_REDIRECT_URL=$(DEV_DISCORD_REDIRECT_URL) $(GO) run ./cmd/pyxis serve --bind $(DEV_BACKEND_BIND) 2>&1 | tee /tmp/pyxis-backend-dev.log'
	@echo "Starting pyxis-app Vite in tmux session $(DEV_VITE_SESSION) on http://localhost:3008..."
	@$(TMUX) new-session -d -s $(DEV_VITE_SESSION) -c "$(CURDIR)" 'direnv exec . pnpm --dir web --filter pyxis-app dev --host $(DEV_VITE_HOST) 2>&1 | tee /tmp/pyxis-app-vite.log'
	@echo "Starting pyxis-user-site Vite in tmux session $(DEV_PUBLIC_VITE_SESSION) on http://localhost:3007..."
	@$(TMUX) new-session -d -s $(DEV_PUBLIC_VITE_SESSION) -c "$(CURDIR)" 'direnv exec . pnpm --dir web --filter pyxis-user-site dev --host $(DEV_VITE_HOST) --port 3007 2>&1 | tee /tmp/pyxis-user-site-vite.log'
	@echo ""
	@echo "Development stack started:"
	@echo "  Backend/API: http://$(DEV_BACKEND_BIND)"
	@echo "  Staff app:   http://localhost:3008"
	@echo "  Public site: http://localhost:3007"
	@echo "  OAuth cb:    $(DEV_DISCORD_REDIRECT_URL)"
	@echo ""
	@echo "Attach/logs:"
	@echo "  tmux attach -t $(DEV_BACKEND_SESSION)"
	@echo "  tmux attach -t $(DEV_VITE_SESSION)"
	@echo "  tmux attach -t $(DEV_PUBLIC_VITE_SESSION)"
	@echo "  tail -f /tmp/pyxis-backend-dev.log /tmp/pyxis-app-vite.log /tmp/pyxis-user-site-vite.log"


dev-stop:
	@$(TMUX) kill-session -t $(DEV_BACKEND_SESSION) 2>/dev/null || true
	@$(TMUX) kill-session -t $(DEV_VITE_SESSION) 2>/dev/null || true
	@$(TMUX) kill-session -t $(DEV_PUBLIC_VITE_SESSION) 2>/dev/null || true
	@echo "Stopped tmux sessions $(DEV_BACKEND_SESSION), $(DEV_VITE_SESSION), and $(DEV_PUBLIC_VITE_SESSION)"


dev-logs:
	@echo "== $(DEV_BACKEND_SESSION) =="
	@$(TMUX) capture-pane -pt $(DEV_BACKEND_SESSION) -S -80 2>/dev/null || echo "session not running"
	@echo "== $(DEV_VITE_SESSION) =="
	@$(TMUX) capture-pane -pt $(DEV_VITE_SESSION) -S -80 2>/dev/null || echo "session not running"
	@echo "== $(DEV_PUBLIC_VITE_SESSION) =="
	@$(TMUX) capture-pane -pt $(DEV_PUBLIC_VITE_SESSION) -S -80 2>/dev/null || echo "session not running"

clean:
	$(DOCKER_COMPOSE) down -v
	rm -rf bin/
