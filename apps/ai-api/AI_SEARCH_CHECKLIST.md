# AI Search Setup Checklist

Use this checklist to ensure all steps are completed correctly.

## Prerequisites ✓
- [ ] Node.js >= 22.17.1 installed
- [ ] pnpm 10.13.1 installed
- [ ] Docker and Docker Compose installed
- [ ] Repository cloned and accessible
- [ ] Azure OpenAI credentials received (in `.ai-env` file)

---

## Setup Steps

### 1. Install Dependencies
- [ ] Run `pnpm install` from repo root

### 2. Meilisearch Setup
- [ ] Navigate to `infra/meilisearch/`
- [ ] Copy `.env.example` to `.env`
- [ ] Set `MEILI_MASTER_KEY` to a long random string (64+ chars)
- [ ] Start container: `docker compose -f infra/meilisearch/docker-compose.yml up -d`
- [ ] Verify running: `docker ps | grep meilisearch`
- [ ] Meilisearch accessible at `http://localhost:7700`

### 3. Create API Keys
- [ ] Export master key: `export MEILI_MASTER_KEY=your-master-key`
- [ ] Run: `pnpm -w -C apps/ai-api run setup:create-keys`
- [ ] Copy **Admin Key** (save it)
- [ ] Copy **Search Key** (save it)

### 4. Configure Environment
- [ ] Copy `.ai-env.example` to `.ai-env` (repo root)
- [ ] Paste Admin Key into `MEILISEARCH_ADMIN_KEY`
- [ ] Paste Search Key into `MEILISEARCH_SEARCH_KEY`
- [ ] Verify Azure credentials are present:
  - [ ] `AZURE_KEY`
  - [ ] `AZURE_ENDPOINT`
  - [ ] `AZURE_API_VERSION`
  - [ ] `AZURE_EMBEDDING_DEPLOY_SMALL`
  - [ ] `AZURE_GPT_DEPLOY`

### 5. Initialize Search Index
- [ ] Navigate to `apps/ai-api/`
- [ ] Run: `pnpm run setup` (runs all setup steps - takes 5-10 min)
- [ ] Verify output shows ~768 documents indexed at the end

### 6. Start AI API
- [ ] From `apps/ai-api/`: `pnpm run dev`
- [ ] Verify server starts on port 3001
- [ ] Test health: `curl http://localhost:3001/health`
- [ ] Test search: `curl -X POST http://localhost:3001/api/search -H "Content-Type: application/json" -d '{"query": "button"}'`

### 7. Start WWW Frontend
- [ ] Open new terminal
- [ ] From repo root: `pnpm run www`
- [ ] Verify server starts on port 5173
- [ ] Open browser to `http://localhost:5173`

### 8. Test Search Feature
- [ ] Click search icon (magnifying glass) in header
- [ ] Search dialog opens
- [ ] Try single-word query: `button` (Quick mode)
- [ ] Try multi-word query: `how to use button component` (Quick + Smart mode)
- [ ] Verify results appear
- [ ] Verify AI answer appears for multi-word queries
- [ ] Click "Show more" to expand AI answer
- [ ] Verify sources are clickable
- [ ] Test synonym: search `modal` (should find Dialog)

---

## Verification Tests

### Meilisearch
```bash
# Container is running
docker ps | grep meilisearch

# Check logs (should show no errors)
docker compose -f infra/meilisearch/docker-compose.yml logs --tail=50

# Check health
curl http://localhost:7700/health
```

### AI API
```bash
# Health check
curl http://localhost:3001/health

# Quick search
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "button"}'

# AI search
curl -X POST http://localhost:3001/api/ai-search \
  -H "Content-Type: application/json" \
  -d '{"query": "how do I use the button component"}'

# Check index status (or re-run full setup)
cd apps/ai-api
pnpm run setup
```

### Frontend
- [ ] Open `http://localhost:5173` in browser
- [ ] No console errors
- [ ] Search icon visible in header
- [ ] Search dialog opens on click
- [ ] Search input is focused
- [ ] Suggestions appear when empty
- [ ] Results appear when typing
- [ ] Links are clickable
- [ ] Dialog closes on Escape or X button

---

## Common Issues

### "Connection refused" to Meilisearch
- [ ] Check Docker container is running: `docker ps`
- [ ] Check port 7700 is not in use: `lsof -i :7700`
- [ ] Restart container: `docker compose -f infra/meilisearch/docker-compose.yml restart`

### "Invalid API key"
- [ ] Verify `.ai-env` has correct Admin/Search keys
- [ ] Recreate keys if needed (step 3)
- [ ] Ensure no extra spaces in `.ai-env` values

### "No documents found"
- [ ] Re-run complete setup: `pnpm run setup`
- [ ] Check for errors in setup output
- [ ] Verify `.ai-env` has correct Azure credentials

### "Azure OpenAI error"
- [ ] Verify Azure credentials in `.ai-env`
- [ ] Check Azure endpoint is accessible
- [ ] Verify deployment names match (text-embedding-3-small, gpt-4o)

### Search returns no results
- [ ] Re-run complete setup: `pnpm run setup`
- [ ] Check Meilisearch logs for errors
- [ ] Verify documents were ingested (shown at end of setup)

### Frontend can't connect to API
- [ ] Verify AI API is running on port 3001
- [ ] Check CORS configuration in `apps/ai-api/src/server.ts`
- [ ] Check browser console for CORS errors

---

## Environment Files Checklist

### `.ai-env` (repo root) - REQUIRED
```bash
MEILISEARCH_API_URL=http://localhost:7700
MEILISEARCH_ADMIN_KEY=<FROM_STEP_3>
MEILISEARCH_SEARCH_KEY=<FROM_STEP_3>
MEILISEARCH_PROJECT_NAME=designsystemet-search
MEILISEARCH_EMBEDDER_UID=azure-openai-small
AZURE_KEY=<PROVIDED>
AZURE_ENDPOINT=<PROVIDED>
AZURE_API_VERSION=2024-08-01-preview
AZURE_EMBEDDING_DEPLOY_SMALL=text-embedding-3-small
AZURE_GPT_DEPLOY=gpt-4o
```

### `infra/meilisearch/.env` - REQUIRED
```bash
MEILI_MASTER_KEY=<YOUR_LONG_RANDOM_SECRET>
MEILI_ENV=production
MEILI_NO_ANALYTICS=true
MEILI_EXPERIMENTAL_ENABLE_VECTOR_SEARCH=enabled
MEILI_EXPERIMENTAL_ENABLE_EMBEDDERS=enabled
```

---

## Running Services (3 Terminals)

### Terminal 1: Meilisearch
```bash
cd infra/meilisearch
docker compose up
# Keep running, watch logs
```

### Terminal 2: AI API
```bash
cd apps/ai-api
pnpm run dev
# Keep running, watch logs
```

### Terminal 3: WWW Frontend
```bash
# From repo root
pnpm run www
# Keep running, watch logs
```

---

## Success Criteria

✅ All three services running without errors
✅ Search dialog opens in browser
✅ Single-word queries return Quick results
✅ Multi-word queries return both Quick and Smart results
✅ AI answers are formatted with markdown
✅ Sources are expandable and clickable
✅ Synonyms work (e.g., "modal" finds Dialog)
✅ No CORS errors in browser console
✅ Health endpoint returns `{"status": "ok"}`

---

## Cleanup (Optional)

To stop all services:

```bash
# Stop frontend (Ctrl+C in Terminal 3)
# Stop AI API (Ctrl+C in Terminal 2)

# Stop Meilisearch container
docker compose -f infra/meilisearch/docker-compose.yml down

# To also remove data volume (WARNING: deletes all indexed documents)
docker compose -f infra/meilisearch/docker-compose.yml down -v
```

---

## Quick Start (After Initial Setup)

Once everything is configured, you only need to run:

```bash
# Terminal 1
docker compose -f infra/meilisearch/docker-compose.yml up -d

# Terminal 2
cd apps/ai-api && pnpm run dev

# Terminal 3
pnpm run www
```

Then open `http://localhost:5173` and start searching!

---

**Status**: [ ] Setup Complete | [ ] Tested and Working | [ ] Ready for Development
