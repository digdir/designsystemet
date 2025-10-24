#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
const envPathCandidates = [
  path.resolve(__dirname, '.ai-env'),
  path.resolve(__dirname, '../.ai-env'),
  path.resolve(__dirname, '../../.ai-env'),
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

const EMBEDDER_UID = env.MEILISEARCH_EMBEDDER_UID || 'azure-openai-small';
const VECTOR_DIMENSIONS = 1536;

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

  try {
    const embedderConfig = {
      [EMBEDDER_UID]: {
        source: 'userProvided',
        dimensions: VECTOR_DIMENSIONS,
      },
    };

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

    const _result = await response.json();
    console.log('✅ Embedder configured successfully');
    console.log(`   Embedder UID: ${EMBEDDER_UID}`);
    console.log(`   Dimensions: ${VECTOR_DIMENSIONS}`);
  } catch (error) {
    console.error('Error setting up embedder:', error);
    process.exit(1);
  }
}

setupEmbedder();
