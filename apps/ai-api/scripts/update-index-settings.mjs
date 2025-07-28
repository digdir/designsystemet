#!/usr/bin/env node
// Update Meilisearch index settings to make relevant fields filterable

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

async function updateIndexSettings() {
  try {
    const index = meiliClient.index(INDEX_NAME);
    
    console.log('🔍 Checking current index settings...');
    
    // Get current settings
    const currentSettings = await index.getSettings();
    console.log('📋 Current settings:');
    console.log('  Filterable attributes:', currentSettings.filterableAttributes || 'None');
    console.log('  Searchable attributes:', currentSettings.searchableAttributes || 'All');
    console.log('  Sortable attributes:', currentSettings.sortableAttributes || 'None');
    console.log('');
    
    // Define the attributes we want to make filterable
    const newFilterableAttributes = [
      'file_path',  // Keep existing
      'type',       // Enable filtering by document type (component, design-token, etc.)
      'lang',       // Enable filtering by language (en, no)
      'url',        // Enable filtering by URL patterns
    ];
    
    // Define sortable attributes (useful for result ranking)
    const newSortableAttributes = [
      'title',      // Enable sorting by title
      'file_path',  // Enable sorting by file path
    ];
    
    console.log('🚀 Updating index settings...');
    console.log('  New filterable attributes:', newFilterableAttributes);
    console.log('  New sortable attributes:', newSortableAttributes);
    
    // Update filterable attributes
    console.log('📝 Setting filterable attributes...');
    const filterableTask = await index.updateFilterableAttributes(newFilterableAttributes);
    console.log(`✅ Filterable attributes task queued: ${filterableTask.taskUid}`);
    
    // Update sortable attributes
    console.log('📝 Setting sortable attributes...');
    const sortableTask = await index.updateSortableAttributes(newSortableAttributes);
    console.log(`✅ Sortable attributes task queued: ${sortableTask.taskUid}`);
    
    console.log('');
    console.log('🎉 Index settings update completed!');
    console.log('');
    console.log('📊 Benefits of these changes:');
    console.log('  • Filter by type: filter(type = "component") for components only');
    console.log('  • Filter by language: filter(lang = "en") for English docs only');
    console.log('  • Filter by URL patterns: filter(url CONTAINS "storybook") for component docs');
    console.log('  • Sort results by title or file path for better organization');
    console.log('');
    console.log('🧪 Test filtering with the debug script:');
    console.log('  node scripts/debug-search.mjs');
    
  } catch (error) {
    console.error('❌ Failed to update index settings:', error);
    process.exit(1);
  }
}

updateIndexSettings();
