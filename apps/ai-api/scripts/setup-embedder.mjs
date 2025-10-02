#!/usr/bin/env node
// Setup script to register an embedder with Meilisearch
// Usage: node scripts/setup-embedder.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fetch from 'node-fetch';

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

// Configuration
const EMBEDDER_UID = env.MEILISEARCH_EMBEDDER_UID || 'azure-openai-small';
const VECTOR_DIMENSIONS = 1536; // For text-embedding-3-small

async function setupEmbedder() {
  if (!env.MEILISEARCH_API_URL) {
    console.error('Error: MEILISEARCH_API_URL is not defined in environment');
    process.exit(1);
  }

  if (!env.MEILISEARCH_ADMIN_KEY) {
    console.error('Error: MEILISEARCH_ADMIN_KEY is not defined in environment');
    process.exit(1);
  }

  const INDEX_NAME = env.MEILISEARCH_PROJECT_NAME || 'designsystemet-search';
  console.log(
    `Setting up embedder "${EMBEDDER_UID}" for index "${INDEX_NAME}" in Meilisearch...`,
  );

  try {
    // Since we generate embeddings ourselves (see ingest.mjs),
    // "source: 'userProvided'" tells MeiliSearch to use those
    const embedderConfig = {
      [EMBEDDER_UID]: {
        source: 'userProvided',
        dimensions: VECTOR_DIMENSIONS,
      },
    };

    console.log('Embedder configuration:');
    console.log(JSON.stringify(embedderConfig, null, 2));

    // Update embedders settings for the index
    const response = await fetch(
      `${env.MEILISEARCH_API_URL}/indexes/${INDEX_NAME}/settings/embedders`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.MEILISEARCH_ADMIN_KEY}`,
        },
        body: JSON.stringify(embedderConfig),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to create embedder: ${response.status} ${response.statusText}`,
      );
      console.error(errorText);
      process.exit(1);
    }

    const result = await response.json();
    console.log(
      `Successfully configured embedder "${EMBEDDER_UID}" for index "${INDEX_NAME}"`,
    );
    console.log('Response:');
    console.log(JSON.stringify(result, null, 2));

    console.log('\nNext steps:');
    console.log(
      `1. MEILISEARCH_EMBEDDER_UID=${EMBEDDER_UID} is already in your .ai-env file`,
    );
    console.log(
      '2. Wait for the embedder setup task to complete (check task status if needed)',
    );
    console.log(
      '3. Make sure you have documents with embeddings ingested (run: node scripts/ingest.mjs)',
    );
    console.log('4. Test the search with: npm run test-rag');
  } catch (error) {
    console.error('Error setting up embedder:', error);
    process.exit(1);
  }
}

setupEmbedder();
