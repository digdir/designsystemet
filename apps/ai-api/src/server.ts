import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { Meilisearch, type SearchResponse } from 'meilisearch';
import NodeCache from 'node-cache';

// Interface for search result objects
interface SearchResult {
  title?: string;
  url?: string;
  content?: string;
  type?: string;
  _score?: number;
  [key: string]: unknown; // Allow for additional properties
}

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

// Meilisearch client for searching
const meiliSearchClient = new Meilisearch({
  host: process.env.MEILISEARCH_API_URL || '',
  apiKey: process.env.MEILISEARCH_SEARCH_KEY || '', // Use search key for frontend-facing API
});

// Meilisearch client for admin operations (anything that isnt searching)
const meiliAdminClient = new Meilisearch({
  host: process.env.MEILISEARCH_API_URL || '',
  apiKey: process.env.MEILISEARCH_ADMIN_KEY || '',
});

// Constants
const INDEX_NAME =
  process.env.MEILISEARCH_PROJECT_NAME || 'designsystemet-search';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ALLOWED_ORIGINS
      ? process.env.CORS_ALLOWED_ORIGINS.split(',')
      : [
          'http://localhost:3000',
          'http://localhost:5173',
          'https://designsystemet.no',
        ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Simple response cache with 30min TTL
const responseCache = new NodeCache({ stdTTL: 1800, checkperiod: 120 });

app.use(express.json());

// Health check endpoint
app.get('/health', async (_req, res) => {
  try {
    // Check if Meilisearch is reachable
    const health = await meiliSearchClient.health();
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      meilisearch: health.status === 'available' ? 'ok' : 'error',
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Service dependencies are not available',
      timestamp: new Date().toISOString(),
    });
  }
});

// Helper functions
async function embedText(text: string) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new Error('No text provided for embedding');
  }

  const url = `${process.env.AZURE_ENDPOINT}/openai/deployments/${process.env.AZURE_EMBEDDING_DEPLOY_SMALL}/embeddings?api-version=${process.env.AZURE_API_VERSION}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'api-key': process.env.AZURE_KEY || '',
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ input: text }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Embedding failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data = await response.json();
  return data.data[0].embedding;
}

async function generateChatCompletion(
  messages: Array<{ role: string; content: string }>,
) {
  const url = `${process.env.AZURE_ENDPOINT}/openai/deployments/${process.env.AZURE_GPT_DEPLOY}/chat/completions?api-version=${process.env.AZURE_API_VERSION}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'api-key': process.env.AZURE_KEY || '',
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      messages,
      temperature: 0.2,
      max_tokens: 800,
      top_p: 0.9,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Chat completion failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return await response.json();
}

function formatChatResponse(
  content: string,
  sources: Array<{ title: string; url: string }> = [],
) {
  // Format sources with numbers and URLs
  const formattedContent = content;

  // Extract source citations from content [1], [2], etc.
  const citations = content.match(/\[\d+\]/g) || [];

  // Generate source information if we have citations and sources
  let sourceInfo = '';
  if (citations.length > 0 && sources.length > 0) {
    sourceInfo = '\n\nSources:\n';
    for (let i = 0; i < Math.min(citations.length, sources.length); i++) {
      sourceInfo += `[${i + 1}] ${sources[i].title} - ${sources[i].url}\n`;
    }
  }

  return formattedContent + sourceInfo;
}

/**
 * Search function that tries vector search if possible, with fallback to keyword search.
 *
 * VECTOR SEARCH REQUIREMENTS:
 * 1. Meilisearch v1.4+ is required for vector/embedder support
 * 2. On Meilisearch Cloud, vector search must be enabled in project settings
 * 3. An embedder must be registered (see setup-embedder.mjs script)
 * 4. MEILISEARCH_EMBEDDER_UID environment variable should contain the embedder name
 */
async function vectorSearch(query: string, limit = 5) {
  try {
    // Try to generate embedding for semantic search
    let embedding: number[] | null = null;
    try {
      embedding = await embedText(query);
    } catch (embeddingError) {
      console.warn(
        'Embedding generation failed, falling back to keyword search:',
        embeddingError,
      );
    }

    // Search Meilisearch - try vector search first, fall back to basic search if it fails
    const index = meiliSearchClient.index(INDEX_NAME);
    let searchResponse: SearchResponse;

    if (embedding) {
      try {
        // Try vector search with embedder
        const embedderUid =
          process.env.MEILISEARCH_EMBEDDER_UID || 'azure-openai-small';

        // First, try full hybrid search with vector + embedder
        try {
          searchResponse = await index.search(query, {
            limit: limit,
            vector: embedding,
            hybrid: {
              semanticRatio: 0.7, // 70% vector search, 30% keyword search
              embedder: embedderUid,
            },
          });
          console.log('Hybrid search successful');
        } catch (hybridError) {
          // If embedder-based search fails, try just vector search
          console.warn('Hybrid search failed, vector-only:', hybridError);
          searchResponse = await index.search(query, {
            limit: limit,
            vector: embedding,
          });
          console.log('Vector-only search successful');
        }
      } catch (vectorSearchError) {
        console.warn(
          'Vector searches failed, trying basic search:',
          vectorSearchError,
        );
        searchResponse = await index.search(query, { limit });
      }
    } else {
      searchResponse = await index.search(query, { limit });
    }

    return searchResponse?.hits || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

// Quick search endpoint (fast, direct results without AI)
app.post('/api/search', async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({
      error: 'Invalid or missing query parameter',
    });
  }

  try {
    // Get search results
    const searchResults = await vectorSearch(query);

    // Deduplicate by URL - keep only the highest scoring result per document
    const deduplicatedResults = deduplicateByDocument(searchResults);

    // Format results for quick search
    const formattedResults = deduplicatedResults
      .slice(0, 8)
      .map((doc: SearchResult) => ({
        title: doc.title,
        content:
          doc.content?.substring(0, 200) +
          ((doc.content?.length ?? 0) > 200 ? '...' : ''),
        url: doc.url,
        type: doc.type || 'component',
      }));

    res.status(200).json({
      query,
      results: formattedResults,
      count: formattedResults.length,
      deduplication: {
        original: searchResults.length,
        deduplicated: deduplicatedResults.length,
      },
    });
  } catch (error: unknown) {
    console.error('Quick search error:', error);
    res.status(500).json({
      error: 'An error occurred processing your search',
      message:
        process.env.NODE_ENV === 'development' && error instanceof Error
          ? error.message
          : undefined,
    });
  }
});

// Helper function to normalize URLs for deduplication
function normalizeUrl(url: string): string {
  return url
    .replace('/content/', '/') // Remove /content/ prefix variations
    .replace(/\/$/, '') // Remove trailing slash
    .toLowerCase() // Case insensitive matching
    .replace(/[?#].*$/, ''); // Remove query params and fragments
}

// Helper function to deduplicate search results by document URL
// Keeps the highest-scoring result/chunk for each normalized URL
function deduplicateByDocument(results: SearchResult[]): SearchResult[] {
  const urlMap = new Map<string, SearchResult>();

  for (const result of results) {
    // Don't show test content or content without url
    if (
      !result.url ||
      result.title?.includes('.test') ||
      result.title?.toLowerCase().includes('test file') ||
      result.url.includes('/test/')
    )
      continue;

    const normalizedUrl = normalizeUrl(result.url);
    const existing = urlMap.get(normalizedUrl);

    // Keep the one with higher score, or first if no score available
    if (
      !existing ||
      (result._score && existing._score && result._score > existing._score) ||
      (result._score && !existing._score)
    ) {
      urlMap.set(normalizedUrl, result);
    }
  }

  // Return results sorted by score (highest first)
  return Array.from(urlMap.values()).sort(
    (a, b) => (b._score || 0) - (a._score || 0),
  );
}

// AI search endpoint with RAG pipeline
app.post('/api/ai-search', async (req, res) => {
  const startTime = Date.now();
  const { query, conversationId = null } = req.body;

  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({
      error: 'Invalid or missing query parameter',
    });
  }

  try {
    // Generate cache key from query and conversation ID
    const cacheKey = crypto
      .createHash('md5')
      .update(`${query}|${conversationId || ''}`)
      .digest('hex');

    // Check cache first
    const cachedResponse = responseCache.get(cacheKey);
    if (cachedResponse) {
      console.log(`Cache hit for query: ${query.substring(0, 30)}...`);
      return res.status(200).json({
        ...cachedResponse,
        fromCache: true,
      });
    }

    // Get search results
    let searchResults: Array<SearchResult> = [];
    try {
      searchResults = await vectorSearch(query);
      console.log(`Search returned ${searchResults.length} results`);
      if (searchResults.length > 0) {
        console.log('First result:', {
          title: searchResults[0].title,
          url: searchResults[0].url,
          content: searchResults[0].content?.substring(0, 100) + '...', // Log just the beginning
        });
      }
    } catch (searchError) {
      console.error('Vector search error:', searchError);
      // Fall back to empty results if search fails completely
      searchResults = [];
    }

    // Extract and format context from search results
    const context = searchResults
      .map((doc: SearchResult) => {
        return `Title: ${doc.title}\n\nURL: ${doc.url}\n\nContent: ${doc.content}`;
      })
      .join('\n\n');

    console.log(`Context length: ${context.length} characters`);
    console.log(`Number of sources: ${searchResults.length}`);

    // Source documents for citations
    const sources = searchResults.map((doc: SearchResult) => ({
      title: doc.title,
      url: doc.url,
    }));

    // Prepare prompt
    const messages = [
      {
        role: 'system',
        content: `You are an AI assistant for Digdir Designsystemet, a Norwegian design system for digital services. 
        Answer questions about the components, patterns, and guidelines based on the provided context.
        Always be helpful, accurate, and concise.
        
        If the question can be answered using the provided context, use that information and cite your sources using [1], [2], etc.
        If there's no relevant context, or the context doesn't contain the information needed, provide a general response based on your knowledge of design systems.
        
        Use Norwegian (bokmål) for most responses, but you can respond in English if the question is in English.
        
        Guidelines:
        1. Focus on providing accurate information about the design system's components and patterns.
        2. Include code examples when appropriate, formatted in markdown.
        3. When answering questions about components, mention their purpose, usage, and any important variants.
        4. Do not make up information about the design system that isn't in the provided context.
        5. If you're unsure about something, be honest about your uncertainty.
        
        Context:
        ${context}`,
      },
      {
        role: 'user',
        content: query,
      },
    ];

    // Generate completion
    const completion = await generateChatCompletion(messages);
    const response = completion.choices[0].message.content;

    // Format response with sources
    const formattedResponse = formatChatResponse(
      response,
      sources as Array<{ title: string; url: string }>,
    );

    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Prepare final response object
    const finalResponse = {
      query,
      answer: formattedResponse,
      sources: sources,
      responseTime,
    };

    // Cache the response
    responseCache.set(cacheKey, finalResponse);

    // Send response
    res.status(200).json(finalResponse);
  } catch (error: unknown) {
    console.error('AI search error:', error);
    res.status(500).json({
      error: 'An error occurred processing your request',
      message:
        process.env.NODE_ENV === 'development' && error instanceof Error
          ? error.message
          : undefined,
    });
  }
});

// Endpoint to clear cache (admin only)
app.post('/api/admin/clear-cache', (req, res) => {
  const authHeader = req.headers.authorization;
  const apiKey = authHeader?.split(' ')[1]; // Format: Bearer <API_KEY>

  if (apiKey !== process.env.MEILISEARCH_ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const stats = responseCache.getStats();
  responseCache.flushAll();

  res.status(200).json({
    message: 'Cache cleared successfully',
    previousStats: stats,
  });
});

// Endpoint to get index info (admin only)
app.get('/api/admin/index-info', async (req, res) => {
  const authHeader = req.headers.authorization;
  const apiKey = authHeader?.split(' ')[1]; // Format: Bearer <API_KEY>

  if (apiKey !== process.env.MEILISEARCH_ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const index = meiliAdminClient.index(INDEX_NAME);
    const stats = await index.getStats();
    const settings = await index.getSettings();

    res.status(200).json({
      indexName: INDEX_NAME,
      stats,
      settings,
    });
  } catch (error) {
    console.error('Error fetching index info:', error);
    res.status(500).json({
      error: 'An error occurred fetching index information',
      message:
        process.env.NODE_ENV === 'development' && error instanceof Error
          ? error.message
          : undefined,
    });
  }
});

// Error handling middleware
app.use((err, _req: express.Request, res: express.Response) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'An unexpected error occurred',
    message:
      process.env.NODE_ENV === 'development' && err instanceof Error
        ? err.message
        : undefined,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
