# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS web
WORKDIR /src/web

COPY web/package.json web/pnpm-lock.yaml web/pnpm-workspace.yaml web/tsconfig.json ./
COPY web/packages ./packages

RUN corepack enable \
  && corepack prepare pnpm@9.0.0 --activate \
  && pnpm install --frozen-lockfile \
  && pnpm --filter pyxis-types build \
  && pnpm --filter pyxis-components build \
  && pnpm --filter pyxis-user-site build

FROM golang:1.26-bookworm AS build
WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .
COPY --from=web /src/web/packages/pyxis-user-site/dist ./internal/web/embed/public

RUN CGO_ENABLED=1 go build -tags embed -trimpath -o /out/pyxis ./cmd/pyxis

FROM debian:bookworm-slim AS runtime

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && useradd --system --uid 10001 --home-dir /app --shell /usr/sbin/nologin appuser

WORKDIR /app

COPY --from=build /out/pyxis /usr/local/bin/pyxis
COPY bot /app/bot

RUN mkdir -p /data/flyers \
  && chown -R appuser:appuser /app /data \
  && chmod +x /usr/local/bin/pyxis

USER appuser

EXPOSE 8080
VOLUME ["/data"]

ENTRYPOINT ["pyxis"]
CMD ["serve"]
