#!/usr/bin/env node
// Debug script to check what's in Meilisearch index

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
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
const INDEX_NAME = env.MEILISEARCH_PROJECT_NAME || 'designsystemet-search';

// Initialize client
const meiliClient = new Meilisearch({
  host: env.MEILISEARCH_API_URL,
  apiKey: env.MEILISEARCH_ADMIN_KEY,
});

async function debugSearch() {
  try {
    const index = meiliClient.index(INDEX_NAME);
    
    // Check index stats
    console.log('📊 Index Stats:');
    const stats = await index.getStats();
    console.log(`  Documents: ${stats.numberOfDocuments}`);
    console.log(`  Index size: ${stats.databaseSize} bytes`);
    console.log('');
    
    // Search for Button component specifically
    console.log('🔍 Searching for "Button component":');
    const buttonResults = await index.search('Button component', { limit: 5 });
    console.log(`  Found ${buttonResults.hits.length} results:`);
    
    buttonResults.hits.forEach((hit, i) => {
      console.log(`  ${i + 1}. ${hit.title} (${hit.type || 'unknown type'})`);
      console.log(`     URL: ${hit.url}`);
      console.log(`     Content preview: ${hit.content.substring(0, 100)}...`);
      console.log('');
    });
    
    // Search for "Button" only
    console.log('🔍 Searching for "Button":');
    const simpleButtonResults = await index.search('Button', { limit: 5 });
    console.log(`  Found ${simpleButtonResults.hits.length} results:`);
    
    simpleButtonResults.hits.forEach((hit, i) => {
      console.log(`  ${i + 1}. ${hit.title} (${hit.type || 'unknown type'})`);
      console.log(`     URL: ${hit.url}`);
      console.log(`     Content preview: ${hit.content.substring(0, 100)}...`);
      console.log('');
    });
    
    // Check what component types we have
    console.log('🔍 Searching for documents with type "combined":');
    const componentResults = await index.search('', { 
      limit: 10,
      filter: 'type = combined'
    });
    console.log(`  Found ${componentResults.hits.length} component documents:`);
    
    componentResults.hits.forEach((hit, i) => {
      console.log(`  ${i + 1}. ${hit.title}`);
    });
    
  } catch (error) {
    console.error('❌ Debug search failed:', error);
  }
}

debugSearch();
