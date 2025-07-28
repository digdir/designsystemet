#!/usr/bin/env node
// Inspect what fields are actually present in our documents

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

async function inspectDocumentFields() {
  try {
    const index = meiliClient.index(INDEX_NAME);
    
    console.log('🔍 Inspecting document fields...\n');
    
    // Get a few sample documents to see their structure
    const results = await index.search('', { limit: 10 });
    
    console.log(`📊 Found ${results.hits.length} sample documents\n`);
    
    // Analyze field presence across documents
    const fieldAnalysis = {};
    const sampleValues = {};
    
    results.hits.forEach((doc, index) => {
      Object.keys(doc).forEach(field => {
        if (!fieldAnalysis[field]) {
          fieldAnalysis[field] = 0;
          sampleValues[field] = [];
        }
        fieldAnalysis[field]++;
        
        // Store a few sample values for each field
        if (sampleValues[field].length < 3) {
          const value = doc[field];
          const shortValue = typeof value === 'string' && value.length > 50 
            ? value.substring(0, 50) + '...' 
            : value;
          sampleValues[field].push(shortValue);
        }
      });
    });
    
    console.log('📋 Field Analysis:');
    Object.entries(fieldAnalysis).forEach(([field, count]) => {
      const percentage = ((count / results.hits.length) * 100).toFixed(0);
      console.log(`  ${field}: ${count}/${results.hits.length} documents (${percentage}%)`);
      
      // Show sample values
      if (sampleValues[field].length > 0) {
        const samples = sampleValues[field].slice(0, 2).map(v => `"${v}"`).join(', ');
        console.log(`    Sample values: ${samples}`);
      }
      console.log('');
    });
    
    // Check specifically for documents that should have a 'type' field
    console.log('🔍 Looking for documents with specific patterns...\n');
    
    // Search for Button component specifically
    const buttonResults = await index.search('Button Component', { limit: 3 });
    console.log(`📝 Button Component documents (${buttonResults.hits.length} found):`);
    buttonResults.hits.forEach((doc, i) => {
      console.log(`  ${i+1}. "${doc.title}"`);
      console.log(`     ID: ${doc.id}`);
      console.log(`     Type: ${doc.type || 'MISSING'}`);
      console.log(`     Lang: ${doc.lang || 'MISSING'}`);
      console.log(`     URL: ${doc.url}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Inspection failed:', error);
  }
}

inspectDocumentFields();
