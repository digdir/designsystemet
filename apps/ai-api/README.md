# AI API - Designsystemet Search Backend

Backend API for AI-powered search in Designsystemet documentation.

## Quick Start

```bash
# 1. Make sure Meilisearch is running
docker compose -f ../../infra/meilisearch/docker-compose.yml up -d

# 2. Configure environment (see root .ai-env.example)
# Make sure ".ai-env" is in apps/ai-api with all required values

# 3. Run complete setup (first time, when things break, big changes, etc.)
pnpm run setup

# 4. Start the API server
# Server will be available at `http://localhost:3001`
pnpm run dev
```

## Available Commands

### Main Commands
- `pnpm run setup` - **Run this first!** Complete setup: embedder + ingest + synonyms + verify
- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server

### Setup Commands (individual steps)
- `pnpm run setup:embedder` - Configure Azure OpenAI embedder
- `pnpm run setup:ingest` - Ingest 768+ documents (5-10 min)
- `pnpm run setup:synonyms` - Configure 32 synonym groups
- `pnpm run setup:create-keys` - Create Meilisearch Admin/Search keys

### Testing & Verification
- `pnpm run check:meili` - Verify Meilisearch status and document count
- `pnpm run test:smoke` - Test Azure OpenAI connection
- `pnpm run test:rag` - Test RAG endpoint

## API Endpoints

### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-02T10:00:00.000Z",
  "meilisearch": "ok"
}
```

### `POST /api/search`
Fast keyword + vector search (Quick mode).

**Request:**
```json
{
  "query": "button"
}
```

**Response:**
```json
{
  "results": [
    {
      "title": "Button",
      "content": "Button component for user actions...",
      "url": "/components/button",
      "type": "component"
    }
  ]
}
```

### `POST /api/ai-search`
AI-powered conversational search (Smart mode).

**Request:**
```json
{
  "query": "how do I use the button component"
}
```

**Response:**
```json
{
  "answer": "The Button component is used for...",
  "sources": [
    {
      "title": "Button Component",
      "url": "/components/button"
    }
  ]
}
```

## Environment Variables

Required in `.ai-env` (repo root):

```bash
# Meilisearch
MEILISEARCH_API_URL=http://localhost:7700
MEILISEARCH_ADMIN_KEY=<generated>
MEILISEARCH_SEARCH_KEY=<generated>
MEILISEARCH_PROJECT_NAME=designsystemet-search
MEILISEARCH_EMBEDDER_UID=azure-openai-small

# Azure OpenAI
AZURE_KEY=<provided>
AZURE_ENDPOINT=<provided>
AZURE_API_VERSION=2024-08-01-preview
AZURE_EMBEDDING_DEPLOY_SMALL=text-embedding-3-small
AZURE_GPT_DEPLOY=gpt-4o
```

## Troubleshooting

### "Connection refused" to Meilisearch
```bash
# Check if Meilisearch is running
docker ps | grep meilisearch

# Start if not running
docker compose -f ../../infra/meilisearch/docker-compose.yml up -d
```

### No search results / Something not working
```bash
# Re-run complete setup (fixes most issues)
pnpm run setup
```

### "Invalid API key"
```bash
# Recreate keys
export MEILI_MASTER_KEY=your-master-key
pnpm run setup:create-keys

# Update .ai-env with new keys
```

## Architecture

- **Express** server with TypeScript
- **Meilisearch** for vector + keyword search
- **Azure OpenAI** for embeddings (text-embedding-3-small) and chat (GPT-4o)
- **NodeCache** for response caching (30min TTL)
- **CORS** enabled for localhost:5173 and production

## Documentation

See repo root for complete guides:
- `AI_SEARCH_QUICK_START.md` - 10-minute setup guide
- `AI_SEARCH_CHECKLIST.md` - Step-by-step checklist

## Notes

- **Always use the same embedding model** for ingestion and search (text-embedding-3-small)
- Response caching reduces Azure OpenAI costs
- Document deduplication prevents "part 1/2" clutter
- 32 synonym groups improve search accuracy (e.g., "modal" → Dialog)
