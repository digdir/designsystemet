#!/usr/bin/env node
// Quick smoke test for AI infra: Azure embeddings, Azure chat, and Meilisearch.
// Usage:  node scripts/ai-smoke-test.mjs  (ensure `.ai-env` is loaded in your shell)

// Load environment variables from .ai-env if running directly (optional)
import fs from 'fs';
import path from 'path';
import { Meilisearch } from 'meilisearch';

const envPathCandidates = [
  path.resolve(process.cwd(), '../.ai-env'),  // When run from apps/ai-api
  path.resolve(process.cwd(), 'apps/.ai-env'), // When run from root
  path.resolve(process.cwd(), '.ai-env'),
];

for (const p of envPathCandidates) {
  if (fs.existsSync(p)) {
    const lines = fs.readFileSync(p, 'utf8')
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

function assertEnv(name) {
  if (!env[name]) throw new Error(`Environment variable ${name} is required.`);
}

try {
  ['AZURE_KEY', 'AZURE_ENDPOINT', 'AZURE_API_VERSION', 'AZURE_EMBEDDING_DEPLOY_SMALL', 'AZURE_GPT_DEPLOY', 'MEILISEARCH_ADMIN_KEY', 'MEILISEARCH_API_URL'].forEach(assertEnv);
} catch (e) {
  console.error(`❌ ${e.message}\nLoad env vars with:  export $(grep -v '^#' apps/.ai-env | xargs)`);
  process.exit(1);
}

async function testEmbedding() {
  const url = `${env.AZURE_ENDPOINT}/openai/deployments/${env.AZURE_EMBEDDING_DEPLOY_SMALL}/embeddings?api-version=${env.AZURE_API_VERSION}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': env.AZURE_KEY,
    },
    body: JSON.stringify({ input: 'What is the answer to life, the universe and everything?' }),
  });
  if (!resp.ok) throw new Error(`Embedding failed: ${resp.status} ${resp.statusText}`);
  console.log('✔ Azure embedding endpoint reachable');
}

async function testChat() {
  const url = `${env.AZURE_ENDPOINT}/openai/deployments/${env.AZURE_GPT_DEPLOY}/chat/completions?api-version=${env.AZURE_API_VERSION}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': env.AZURE_KEY,
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'What is the answer to life, the universe and everything? in short.' }],
      max_tokens: 3,
      temperature: 0,
    }),
  });
  if (!resp.ok) throw new Error(`Chat failed: ${resp.status} ${resp.statusText}`);
  const data = await resp.json();
  console.log('✔ Azure chat endpoint reachable - response:', data.choices?.[0]?.message?.content);
}

async function testMeili() {
  const client = new Meilisearch({
    host: env.MEILISEARCH_API_URL,
    apiKey: env.MEILISEARCH_ADMIN_KEY,
  });
  const indexes = await client.getIndexes();
  console.log(`✔ Meilisearch reachable - ${Array.isArray(indexes) ? indexes.length : Object.keys(indexes).length} indexes found`);
}

(async () => {
  try {
    await testEmbedding();
    await testChat();
    await testMeili();
    console.log('\n🎉  All smoke tests passed');
  } catch (err) {
    console.error('Smoke test error →', err.message);
    process.exit(1);
  }
})();
