#!/usr/bin/env node
// Check current embedder configuration in Meilisearch

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Meilisearch } from 'meilisearch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
const envPathCandidates = [
  path.resolve(__dirname, '../../.ai-env'),
  path.resolve(__dirname, '../../../apps/.ai-env'),
  path.resolve(__dirname, '../../../.ai-env'),
];

for (const p of envPathCandidates) {
  if (fs.existsSync(p)) {
    const lines = fs
      .readFileSync(p, 'utf8')
      .split(/\r?\n/)
      .filter((l) => l.trim() && !l.startsWith('#'));
    for (const line of lines) {
      const [k, ...rest] = line.split('=');
      if (!(k in process.env)) process.env[k] = rest.join('=');
    }
    console.log(`Loaded env vars from ${p}`);
    break;
  }
}

const env = process.env;
const INDEX_NAME = env.MEILISEARCH_PROJECT_NAME || 'designsystemet-search';

// Initialize client
const meiliClient = new Meilisearch({
  host: env.MEILISEARCH_API_URL,
  apiKey: env.MEILISEARCH_ADMIN_KEY,
});

async function checkEmbedderStatus() {
  try {
    const index = meiliClient.index(INDEX_NAME);

    console.log('🔍 Checking embedder configuration...');

    // Get current index settings
    const settings = await index.getSettings();
    console.log('📋 Current index settings:');
    console.log('  Embedders:', settings.embedders || 'None configured');
    console.log(
      '  Filterable attributes:',
      settings.filterableAttributes || 'None configured',
    );
    console.log(
      '  Searchable attributes:',
      settings.searchableAttributes || 'All attributes',
    );
    console.log('');

    // Check what embedder UID the server expects
    const expectedEmbedderUID =
      env.MEILISEARCH_EMBEDDER_UID || 'azure-openai-small';
    console.log(`🎯 Expected embedder UID: ${expectedEmbedderUID}`);

    // Test if embedder exists by trying to use it
    try {
      console.log('🧪 Testing vector search with embedder...');
      const testQuery = 'Button component';

      // Generate test embedding
      const testEmbedding = await generateTestEmbedding(testQuery);

      // Try hybrid search
      const hybridResult = await index.search(testQuery, {
        limit: 1,
        vector: testEmbedding,
        hybrid: {
          semanticRatio: 0.7,
          embedder: expectedEmbedderUID,
        },
      });

      console.log('✅ Hybrid search with embedder works!');
      console.log(`   Found ${hybridResult.hits.length} results`);
    } catch (embedderError) {
      console.log(
        '❌ Hybrid search with embedder failed:',
        embedderError.message,
      );

      // Try vector-only search
      try {
        console.log('🧪 Testing vector-only search...');
        const testEmbedding = await generateTestEmbedding('Button component');

        const vectorResult = await index.search('Button component', {
          limit: 1,
          vector: testEmbedding,
        });

        console.log('✅ Vector-only search works!');
        console.log(`   Found ${vectorResult.hits.length} results`);
      } catch (vectorError) {
        console.log('❌ Vector-only search also failed:', vectorError.message);
      }
    }
  } catch (error) {
    console.error('❌ Failed to check embedder status:', error);
  }
}

async function generateTestEmbedding(text) {
  const url = `${env.AZURE_ENDPOINT}/openai/deployments/${env.AZURE_EMBEDDING_DEPLOY_SMALL}/embeddings?api-version=${env.AZURE_API_VERSION}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': env.AZURE_KEY,
    },
    body: JSON.stringify({ input: text }),
  });

  if (!response.ok) {
    throw new Error(`Embedding failed: ${response.status}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

checkEmbedderStatus();
