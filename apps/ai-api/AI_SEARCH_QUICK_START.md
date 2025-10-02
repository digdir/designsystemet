# AI Search Quick Start Guide

**TL;DR**: Get the AI search running in 10 minutes.

**Updated**: Step 5 uses individual commands for reliability. Each step is quick and clear! ✨

---

## Prerequisites Check

```bash
# Check Node.js version (need >= 22.17.1)
node --version

# Check pnpm version (need 10.13.1)
pnpm --version

# Check Docker
docker --version
docker compose version
```

### Don't Have Docker?

Download from https://www.docker.com/products/docker-desktop/

This also install Docker Compose and Docker CLI, the tools we use to run Meilisearch. It may require a restart after install. 

---

## 5-Step Setup

### 1️⃣ Install Dependencies (2 min)

```bash
cd /path/to/designsystemet
pnpm install
```

### 2️⃣ Start Meilisearch (1 min)

```bash
# Create environment file
cd infra/meilisearch
cp .env.example .env

# Edit .env and set MEILI_MASTER_KEY to a long random string
# Example: MEILI_MASTER_KEY=my-super-secret-key-that-is-very-long-and-random-12345678

# Start container
docker compose up -d

# Verify it's running
docker ps | grep meilisearch
```

### 3️⃣ Create API Keys (1 min)

```bash
# Set master key (use the same value from .env)
export MEILI_MASTER_KEY=my-super-secret-key-that-is-very-long-and-random-12345678

# Generate keys
cd ../../  # back to repo root
pnpm -w -C apps/ai-api run setup:create-keys

# Copy the two keys that are printed:
# - Admin Key: meili_admin_xxxxx
# - Search Key: meili_search_xxxxx
```

### 4️⃣ Configure Environment (1 min)

```bash
# Create .ai-env from example
cp .ai-env.example .ai-env

# Edit .ai-env and paste the keys from step 3
nano .ai-env

# Make sure these are set:
# MEILISEARCH_ADMIN_KEY=meili_admin_xxxxx
# MEILISEARCH_SEARCH_KEY=meili_search_xxxxx
# AZURE_KEY=<should be provided to you>
# AZURE_ENDPOINT=<should be provided to you>
```

### 5️⃣ Initialize Search Index (5-10 min)

```bash
cd apps/ai-api

# Step 1: Configure embedder
pnpm run setup:embedder

# Step 2: Ingest documents (takes 5-10 minutes)
pnpm run setup:ingest

# Step 3: Configure synonyms
pnpm run setup:synonyms

# Step 4: Verify setup
pnpm run check:meili
# Should show: "📊 Index 'designsystemet-search': 621 documents"
```

---

## Running the System

Open **3 terminal windows**:

### Terminal 1: Meilisearch
```bash
docker compose -f infra/meilisearch/docker-compose.yml up
```

### Terminal 2: AI API
```bash
cd apps/ai-api
pnpm run dev
```

### Terminal 3: Frontend
```bash
# From repo root
pnpm run www
```

Then open: **http://localhost:5173**

---

## Quick Test

1. Click the **search icon** (magnifying glass) in the header
2. Type: **button**
3. You should see Quick results appear
4. Type: **how to use button component**
5. You should see both Quick results and an AI answer

---

## Common Commands

### Check Status
```bash
# Meilisearch health
curl http://localhost:7700/health

# AI API health
curl http://localhost:3001/health

# Check index
cd apps/ai-api
pnpm run check:meili
```

### Restart Services
```bash
# Restart Meilisearch
docker compose -f infra/meilisearch/docker-compose.yml restart

# Restart AI API (Ctrl+C and run again)
cd apps/ai-api
pnpm run dev

# Restart Frontend (Ctrl+C and run again)
pnpm run www
```

### Re-initialize Data
```bash
cd apps/ai-api

# Re-run all setup steps
pnpm run setup:embedder
pnpm run setup:ingest
pnpm run setup:synonyms
pnpm run check:meili
```

---

## Troubleshooting

### "Connection refused" to Meilisearch
```bash
# Check if running
docker ps | grep meilisearch

# If not running, start it
docker compose -f infra/meilisearch/docker-compose.yml up -d

# Check logs
docker compose -f infra/meilisearch/docker-compose.yml logs
```

### "Invalid API key"
```bash
# Verify keys in .ai-env
cat .ai-env | grep MEILISEARCH

# If wrong, recreate keys
export MEILI_MASTER_KEY=your-master-key
pnpm -w -C apps/ai-api run setup:create-keys

# Update .ai-env with new keys
```

### No search results
```bash
# Check if documents are indexed
cd apps/ai-api
pnpm run check:meili

# If 0 documents, re-run ingestion
pnpm run setup:ingest
pnpm run check:meili
```

### Frontend can't connect to API
```bash
# Verify AI API is running
curl http://localhost:3001/health

# Check if port 3001 is in use
lsof -i :3001

# Check browser console for CORS errors
```

### Azure OpenAI errors
```bash
# Verify Azure credentials
cat .ai-env | grep AZURE

# Test Azure connection
cd apps/ai-api
pnpm run test:smoke
```

---

## Port Reference

| Service | Port | URL |
|---------|------|-----|
| Meilisearch | 7700 | http://localhost:7700 |
| AI API | 3001 | http://localhost:3001 |
| WWW Frontend | 5173 | http://localhost:5173 |

---

## File Locations

| File | Purpose |
|------|---------|
| `.ai-env` | AI API environment variables |
| `infra/meilisearch/.env` | Meilisearch Docker environment |
| `apps/ai-api/src/server.ts` | API server code |
| `internal/components/src/search-dialog/` | Search UI component |
| `apps/ai-api/scripts/` | Setup and utility scripts |

---

## Test Queries

Try these to verify everything works:

| Query | Expected Result |
|-------|----------------|
| `button` | Quick results for Button component |
| `modal` | Quick results for Dialog (via synonym) |
| `how to use button` | Quick results + AI answer |
| `design tokens` | Results about design tokens |
| `dropdown` | Quick results for Select (via synonym) |

---

## Stop All Services

```bash
# Stop frontend (Ctrl+C in Terminal 3)
# Stop AI API (Ctrl+C in Terminal 2)

# Stop Meilisearch
docker compose -f infra/meilisearch/docker-compose.yml down
```

---

## Daily Workflow (After Initial Setup)

```bash
# Start Meilisearch (Terminal 1)
docker compose -f infra/meilisearch/docker-compose.yml up -d

# Start AI API (Terminal 2)
cd apps/ai-api && pnpm run dev

# Start Frontend (Terminal 3)
pnpm run www

# Open browser
open http://localhost:5173
```

---

## Environment Variables Quick Reference

### Required in `.ai-env`
```bash
MEILISEARCH_API_URL=http://localhost:7700
MEILISEARCH_ADMIN_KEY=<from setup:create-keys>
MEILISEARCH_SEARCH_KEY=<from setup:create-keys>
MEILISEARCH_PROJECT_NAME=designsystemet-search
MEILISEARCH_EMBEDDER_UID=azure-openai-small
AZURE_KEY=<provided>
AZURE_ENDPOINT=<provided>
AZURE_API_VERSION=2024-08-01-preview
AZURE_EMBEDDING_DEPLOY_SMALL=text-embedding-3-small
AZURE_GPT_DEPLOY=gpt-4o
```

### Required in `infra/meilisearch/.env`
```bash
MEILI_MASTER_KEY=<long-random-secret>
MEILI_ENV=production
MEILI_NO_ANALYTICS=true
MEILI_EXPERIMENTAL_ENABLE_VECTOR_SEARCH=enabled
MEILI_EXPERIMENTAL_ENABLE_EMBEDDERS=enabled
```

---

## Help & Support

For detailed information, see:
- `AI_SEARCH_SETUP_GUIDE.md` - Full setup guide
- `AI_SEARCH_CHECKLIST.md` - Step-by-step checklist
- `AI_SEARCH_ARCHITECTURE.md` - System architecture
- `infra/meilisearch/README.md` - Meilisearch details

---

**You're ready to go! 🚀**
