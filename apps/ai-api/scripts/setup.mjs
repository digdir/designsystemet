#!/usr/bin/env node

/**
 * Complete setup script for AI Search
 * Runs all initialization steps in sequence:
 * 1. Configure embedder
 * 2. Ingest documents
 * 3. Configure synonyms
 * 4. Verify setup
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step, total, message) {
  log(
    `\n${colors.bright}[${step}/${total}] ${message}${colors.reset}`,
    colors.blue,
  );
}

function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      cwd: path.dirname(scriptPath),
      env: process.env, // Pass environment variables to child processes
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script exited with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  log('\n╔════════════════════════════════════════════════════════════╗', colors.bright);
  log('║          AI Search - Complete Setup                       ║', colors.bright);
  log('╚════════════════════════════════════════════════════════════╝\n', colors.bright);

  const steps = [
    {
      name: 'Configure Embedder',
      script: path.join(__dirname, 'setup-embedder.mjs'),
      description: 'Setting up Azure OpenAI embedder in Meilisearch',
    },
    {
      name: 'Ingest Documents',
      script: path.join(__dirname, 'ingest.mjs'),
      description: 'Ingesting 768+ documents (this takes 5-10 minutes)',
    },
    {
      name: 'Configure Synonyms',
      script: path.join(__dirname, 'setup-synonyms.mjs'),
      description: 'Configuring 32 synonym groups for better search',
    },
    {
      name: 'Verify Setup',
      script: path.join(__dirname, 'check-meili.mjs'),
      description: 'Checking Meilisearch index and document count',
    },
  ];

  const startTime = Date.now();

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    logStep(i + 1, steps.length, step.name);
    log(`   ${step.description}`, colors.yellow);

    try {
      await runScript(step.script);
      log(`   ✓ ${step.name} completed`, colors.green);
    } catch (error) {
      log(`   ✗ ${step.name} failed: ${error.message}`, colors.red);
      log('\n❌ Setup failed. Please check the error above.\n', colors.red);
      process.exit(1);
    }
  }

  const duration = Math.round((Date.now() - startTime) / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  log('\n╔════════════════════════════════════════════════════════════╗', colors.green);
  log('║          ✓ Setup Complete!                                ║', colors.green);
  log('╚════════════════════════════════════════════════════════════╝', colors.green);
  log(`\n   Time taken: ${minutes}m ${seconds}s\n`, colors.bright);
  log('Next steps:', colors.bright);
  log('  1. Start AI API:    pnpm run dev', colors.yellow);
  log('  2. Start frontend:  pnpm run www (from repo root)', colors.yellow);
  log('  3. Open browser:    http://localhost:5173\n', colors.yellow);
}

main().catch((error) => {
  log(`\n❌ Setup failed: ${error.message}\n`, colors.red);
  process.exit(1);
});
