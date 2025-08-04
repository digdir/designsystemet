#!/usr/bin/env node

import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Get current file and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .ai-env
const envPathCandidates = [
  path.resolve(__dirname, '../../.ai-env'),
  path.resolve(__dirname, '../.ai-env'),
  path.resolve(__dirname, '.ai-env'),
];

for (const p of envPathCandidates) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    console.log(`Loaded env vars from ${p}`);
    break;
  }
}

async function testRAGEndpoint() {
  console.log('Testing RAG API endpoint...');

  const port = process.env.PORT || 3001;
  const baseUrl = `http://localhost:${port}`;
  const endpoint = `${baseUrl}/api/ai-search`;

  // Test queries
  const queries = [
    'What is Designsystemet?',
    'How do I use the Button component?',
    'Can you explain the Accordion component?',
    'What color tokens are available?',
  ];

  console.log(`Will send ${queries.length} test queries to: ${endpoint}`);

  for (const query of queries) {
    console.log(`\n------------------------------`);
    console.log(`Testing query: "${query}"`);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Successful response:');
        console.log(`Query: ${result.query}`);
        console.log(`Response time: ${result.responseTime}ms`);
        console.log(`Sources: ${result.sources.length} documents`);
        console.log('\nAnswer:');
        console.log(result.answer);
      } else {
        console.log('❌ Error response:');
        console.log(result);
      }
    } catch (error) {
      console.error('❌ Error executing test:', error.message);
    }

    // Wait 1 second between requests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

// Run the test
testRAGEndpoint()
  .then(() => console.log('\nTest completed'))
  .catch((err) => console.error('Test failed:', err));
