// Quick health check for self-hosted Meilisearch
// Usage: node scripts/check-meili.mjs
// Loads .ai-env from common locations to read MEILISEARCH_API_URL and MEILISEARCH_PROJECT_NAME

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const candidateEnvPaths = [
  path.resolve(__dirname, '../.ai-env'),
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

const API_URL = process.env.MEILISEARCH_API_URL || 'http://localhost:7700';
const INDEX_NAME =
  process.env.MEILISEARCH_PROJECT_NAME || 'designsystemet-search';
const ADMIN_KEY =
  process.env.MEILISEARCH_ADMIN_KEY || process.env.MEILI_MASTER_KEY || '';

async function check() {
  const healthRes = await fetch(`${API_URL}/health`);
  const health = healthRes.ok
    ? await healthRes.json()
    : { error: `${healthRes.status} ${healthRes.statusText}` };
  console.log(`Health:`, health);

  const headers = ADMIN_KEY ? { Authorization: `Bearer ${ADMIN_KEY}` } : {};
  const idxRes = await fetch(`${API_URL}/indexes`, { headers });
  if (!idxRes.ok) {
    const text = await idxRes.text();
    console.error(
      `Indexes error: ${idxRes.status} ${idxRes.statusText} - ${text}`,
    );
    return;
  }
  const indexData = await idxRes.json();
  const indexes = indexData.results || [];
  console.log(
    `Indexes (${indexes.length}):`,
    indexes.map((i) => i.uid).join(', ') || '(none)',
  );

  // Get detailed stats for our index
  const statsRes = await fetch(`${API_URL}/indexes/${INDEX_NAME}/stats`, {
    headers,
  });
  if (statsRes.ok) {
    const stats = await statsRes.json();
    console.log(
      `\n📊 Index '${INDEX_NAME}': ${stats.numberOfDocuments} documents`,
    );
  }

  // Check embedder settings
  const embRes = await fetch(
    `${API_URL}/indexes/${INDEX_NAME}/settings/embedders`,
    { headers },
  );
  if (embRes.ok) {
    const emb = await embRes.json();
    console.log(
      `\n🔧 Embedders configured:`,
      Object.keys(emb).length > 0 ? '✅' : '❌',
    );
  } else {
    console.log(`\n🔧 Embedders: ❌ Not configured`);
  }

  // Check synonyms
  const synRes = await fetch(
    `${API_URL}/indexes/${INDEX_NAME}/settings/synonyms`,
    { headers },
  );
  if (synRes.ok) {
    const synonyms = await synRes.json();
    const synonymCount = Object.keys(synonyms).length;
    console.log(
      `🔤 Synonyms configured: ${synonymCount > 0 ? '✅' : '❌'} (${synonymCount} terms)`,
    );
  } else {
    console.log(`🔤 Synonyms: ❌ Failed to check`);
  }

  // Version (auth protected in v1.x)
  const verRes = await fetch(`${API_URL}/version`, { headers });
  if (verRes.ok) {
    const ver = await verRes.json();
    console.log(`Version:`, ver);
  } else {
    console.log(
      `Version endpoint not available without auth (${verRes.status})`,
    );
  }
}

check().catch((err) => {
  console.error('❌ Check failed:', err.message);
  process.exit(1);
});
