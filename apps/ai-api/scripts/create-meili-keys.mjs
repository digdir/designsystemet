// Create Meilisearch Admin and Search keys using the master key
// Usage: node scripts/create-meili-keys.mjs
// Env required:
//   MEILISEARCH_API_URL (e.g., http://localhost:7700)
//   MEILI_MASTER_KEY (from your Meili server)
//   MEILISEARCH_PROJECT_NAME (optional, defaults to 'designsystemet-search')

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Load .ai-env from common locations (optional)
const candidateEnvPaths = [
  path.resolve(__dirname, '../../.ai-env'),
  path.resolve(__dirname, '../../../apps/.ai-env'),
  path.resolve(__dirname, '../../../.ai-env'),
];
for (const p of candidateEnvPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    break;
  }
}

const API_URL = process.env.MEILISEARCH_API_URL;
const MASTER_KEY = process.env.MEILI_MASTER_KEY;
const INDEX_NAME =
  process.env.MEILISEARCH_PROJECT_NAME || 'designsystemet-search';

function assertEnv(name) {
  if (!process.env[name]) {
    throw new Error(`Missing required env: ${name}`);
  }
}

try {
  assertEnv('MEILISEARCH_API_URL');
  assertEnv('MEILI_MASTER_KEY');
} catch (e) {
  console.error(`❌ ${e.message}`);
  console.error(
    'Set MEILI_MASTER_KEY in your environment (not in .ai-env), e.g.:',
  );
  console.error('  export MEILI_MASTER_KEY=...');
  console.error(
    'And ensure MEILISEARCH_API_URL is set in .ai-env or your shell.',
  );
  process.exit(1);
}

async function createKey(description, actions, indexes) {
  const res = await fetch(`${API_URL}/keys`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MASTER_KEY}`,
    },
    body: JSON.stringify({ description, actions, indexes, expiresAt: null }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Failed to create key '${description}': ${res.status} ${res.statusText} - ${text}`,
    );
  }
  return res.json();
}

(async () => {
  try {
    console.log(`Creating keys on ${API_URL} for index '${INDEX_NAME}'...`);

    const admin = await createKey('Admin key', ['*'], ['*']);
    const search = await createKey('Search key', ['search'], [INDEX_NAME]);

    console.log('\n✅ Keys created successfully');
    console.log('---');
    console.log(`Admin Key:  ${admin.key}`);
    console.log(`Search Key: ${search.key}`);
    console.log('---');
    console.log('Next steps:');
    console.log('1) Put Admin key into .ai-env as MEILISEARCH_ADMIN_KEY');
    console.log('2) Put Search key into .ai-env as MEILISEARCH_SEARCH_KEY');
    console.log(
      '3) Run: pnpm -w -C apps/ai-api run setup:embedder (if you use Meili embedders)',
    );
    console.log('4) Run: pnpm -w -C apps/ai-api run setup:ingest');
    console.log('5) Run: pnpm -w -C apps/ai-api run setup:synonyms');
  } catch (err) {
    console.error(`❌ ${err.message}`);
    process.exit(1);
  }
})();
