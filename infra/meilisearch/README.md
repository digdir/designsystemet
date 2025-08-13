# Meilisearch (Self-Hosted)

This directory contains a minimal Docker Compose setup for self-hosting Meilisearch with vector search and (optional) embedders API enabled.

## Prerequisites
- Docker and Docker Compose
- A long random master key (kept outside of git)

## Setup
1) Copy env template and set your secret master key
```bash
cp infra/meilisearch/.env.example infra/meilisearch/.env
# edit infra/meilisearch/.env and set MEILI_MASTER_KEY to a long random value
```

2) Start Meilisearch
```bash
# from repo root
docker compose -f infra/meilisearch/docker-compose.yml up -d
```
- Service listens on port 7700. Put it behind HTTPS and restrict exposure in production.

3) Create Admin/Search keys (using the master key)
```bash
# set in your shell for this session only (do not commit)
export MEILI_MASTER_KEY=...your-long-secret...
# create keys; prints Admin and Search keys
pnpm -w -C apps/ai-api run setup:create-keys
```
Paste the printed Admin/Search keys into `.ai-env` as:
- `MEILISEARCH_ADMIN_KEY`
- `MEILISEARCH_SEARCH_KEY`

4) Configure app env
```bash
cp .ai-env.example .ai-env
# edit .ai-env and set MEILISEARCH_API_URL, keys, and Azure values
```

5) Initialize index and data
```bash
# Only if you use Meili embedders (server-side embedder settings)
pnpm -w -C apps/ai-api run setup:embedder

# Ingest docs and vectors
pnpm -w -C apps/ai-api run setup:ingest

# Apply mutual (bidirectional) synonyms
pnpm -w -C apps/ai-api run setup:synonyms
```

6) Verify
```bash
pnpm -w -C apps/ai-api run check:meili
pnpm -w -C apps/ai-api run test:smoke
```

## Notes
- Keep the SAME embedding model for ingestion and query; do NOT mix models.
- If you recreate the index in the future, rerun `setup:synonyms`.
- For production, bind Meilisearch to localhost and expose via a TLS reverse proxy (e.g., Caddy/Nginx/Traefik).
- Schedule volume snapshots or `dumps` for backups.
