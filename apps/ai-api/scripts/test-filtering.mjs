#!/usr/bin/env node
// Test the new filterable attributes

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

const meiliClient = new Meilisearch({
  host: env.MEILISEARCH_API_URL,
  apiKey: env.MEILISEARCH_ADMIN_KEY,
});

async function testFiltering() {
  try {
    const index = meiliClient.index(INDEX_NAME);
    
    console.log('🧪 Testing new filterable attributes...\n');
    
    // Test 1: Filter by language
    console.log('1️⃣ Testing language filtering (lang = "en"):');
    try {
      const englishResults = await index.search('', { 
        limit: 5,
        filter: 'lang = en'
      });
      console.log(`   ✅ Found ${englishResults.hits.length} English documents`);
      if (englishResults.hits.length > 0) {
        console.log(`   Sample: "${englishResults.hits[0].title}"`);
      }
    } catch (err) {
      console.log(`   ❌ Filter failed: ${err.message}`);
    }
    
    // Test 2: Filter by type
    console.log('\n2️⃣ Testing type filtering (type = "component"):');
    try {
      const componentResults = await index.search('', { 
        limit: 5,
        filter: 'type = component'
      });
      console.log(`   ✅ Found ${componentResults.hits.length} component documents`);
      if (componentResults.hits.length > 0) {
        console.log(`   Sample: "${componentResults.hits[0].title}"`);
      }
    } catch (err) {
      console.log(`   ❌ Filter failed: ${err.message}`);
    }
    
    // Test 3: Filter by URL pattern
    console.log('\n3️⃣ Testing URL filtering (url CONTAINS "storybook"):');
    try {
      const storybookResults = await index.search('', { 
        limit: 5,
        filter: 'url CONTAINS storybook'
      });
      console.log(`   ✅ Found ${storybookResults.hits.length} Storybook documents`);
      if (storybookResults.hits.length > 0) {
        console.log(`   Sample: "${storybookResults.hits[0].title}"`);
      }
    } catch (err) {
      console.log(`   ❌ Filter failed: ${err.message}`);
    }
    
    // Test 4: Combined filtering
    console.log('\n4️⃣ Testing combined filtering (lang = "en" AND url CONTAINS "storybook"):');
    try {
      const combinedResults = await index.search('Button', { 
        limit: 3,
        filter: 'lang = en AND url CONTAINS storybook'
      });
      console.log(`   ✅ Found ${combinedResults.hits.length} English Storybook documents matching "Button"`);
      combinedResults.hits.forEach((hit, i) => {
        console.log(`   ${i+1}. "${hit.title}" (${hit.lang})`);
      });
    } catch (err) {
      console.log(`   ❌ Filter failed: ${err.message}`);
    }
    
    console.log('\n🎉 Filtering tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testFiltering();
