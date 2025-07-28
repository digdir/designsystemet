import express from 'express';
import { Meilisearch } from 'meilisearch';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
const envPathCandidates = [
  path.resolve(process.cwd(), '../.ai-env'),
  path.resolve(process.cwd(), 'apps/.ai-env'),
  path.resolve(process.cwd(), '.ai-env'),
];

for (const p of envPathCandidates) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    console.log(`Loaded env vars from ${p}`);
    break;
  }
}

// Create Meilisearch client
const meiliClient = new Meilisearch({
  host: process.env.MEILISEARCH_API_URL || '',
  apiKey: process.env.MEILISEARCH_SEARCH_KEY || '', // Use search key for frontend-facing API
});

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI search endpoint (stub for now)
app.post('/api/ai-search', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    // TODO: Implement the full RAG pipeline
    // 1. Embed the query
    // 2. Search Meilisearch for relevant documents
    // 3. Optional: rerank results
    // 4. Call Azure OpenAI for completion
    
    // For now, just return a simple search result
    const searchResults = await meiliClient.index(process.env.MEILISEARCH_PROJECT_NAME || 'designsystemet-search')
      .search(query, { limit: 5 });
    
    res.json({
      results: searchResults.hits,
      message: "Full RAG implementation coming soon"
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'An error occurred during search' });
  }
});

app.listen(port, () => {
  console.log(`AI API server running at http://localhost:${port}`);
});
