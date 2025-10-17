#!/usr/bin/env node

/**
 * Complete setup script for AI Search
 * Runs all initialization steps in sequence:
 * 1. Configure embedder
 * 2. Ingest documents
 * 3. Configure synonyms
 * 4. Verify setup
 */

import { spawn, exec } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fetch from 'node-fetch';

const execAsync = promisify(exec);

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
      env: process.env,
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

async function checkDocker() {
  try {
    await execAsync('docker ps');
    return true;
  } catch {
    return false;
  }
}

async function checkMeilisearch() {
  try {
    const response = await fetch('http://localhost:7700/health', {
      timeout: 2000,
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function startMeilisearch() {
  const composeFile = path.resolve(
    __dirname,
    '../../../infra/meilisearch/docker-compose.yml',
  );
  await execAsync(`docker compose -f ${composeFile} up -d`);
  // Wait for Meilisearch to be ready
  for (let i = 0; i < 30; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (await checkMeilisearch()) return true;
  }
  return false;
}

async function generateApiKeys() {
  const meilisearchEnvPath = path.resolve(
    __dirname,
    '../../../infra/meilisearch/.env',
  );
  const aiEnvPath = path.resolve(__dirname, '../.ai-env');

  // Read master key from meilisearch .env
  if (!fs.existsSync(meilisearchEnvPath)) {
    throw new Error(
      `Missing ${meilisearchEnvPath}. Copy .env.example and set MEILI_MASTER_KEY.`,
    );
  }

  const meilisearchEnv = fs.readFileSync(meilisearchEnvPath, 'utf8');
  const masterKeyMatch = meilisearchEnv.match(
    /MEILI_MASTER_KEY=(.+)/,
  );
  if (!masterKeyMatch) {
    throw new Error('MEILI_MASTER_KEY not found in infra/meilisearch/.env');
  }
  const masterKey = masterKeyMatch[1].trim();

  // Generate keys
  const response = await fetch('http://localhost:7700/keys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${masterKey}`,
    },
    body: JSON.stringify({
      name: 'Admin Key',
      description: 'Admin key for designsystemet-search',
      actions: ['*'],
      indexes: ['*'],
      expiresAt: null,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create admin key: ${response.statusText}`);
  }

  const adminKeyData = await response.json();
  const adminKey = adminKeyData.key;

  const searchResponse = await fetch('http://localhost:7700/keys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${masterKey}`,
    },
    body: JSON.stringify({
      name: 'Search Key',
      description: 'Search-only key for designsystemet-search',
      actions: ['search'],
      indexes: ['*'],
      expiresAt: null,
    }),
  });

  if (!searchResponse.ok) {
    throw new Error(`Failed to create search key: ${searchResponse.statusText}`);
  }

  const searchKeyData = await searchResponse.json();
  const searchKey = searchKeyData.key;

  // Update .ai-env file
  if (!fs.existsSync(aiEnvPath)) {
    throw new Error(
      `Missing ${aiEnvPath}. Copy .ai-env.example and set Azure credentials.`,
    );
  }

  let aiEnvContent = fs.readFileSync(aiEnvPath, 'utf8');
  aiEnvContent = aiEnvContent.replace(
    /MEILISEARCH_ADMIN_KEY=.*/,
    `MEILISEARCH_ADMIN_KEY=${adminKey}`,
  );
  aiEnvContent = aiEnvContent.replace(
    /MEILISEARCH_SEARCH_KEY=.*/,
    `MEILISEARCH_SEARCH_KEY=${searchKey}`,
  );
  fs.writeFileSync(aiEnvPath, aiEnvContent);

  return { adminKey, searchKey };
}

async function main() {
  log(
    '\n╔════════════════════════════════════════════════════════════╗',
    colors.bright,
  );
  log(
    '║          AI Search - Complete Setup                       ║',
    colors.bright,
  );
  log(
    '╚════════════════════════════════════════════════════════════╝\n',
    colors.bright,
  );

  const steps = [
    {
      name: 'Configure Embedder',
      script: path.join(__dirname, 'setup-embedder.mjs'),
      description: 'Setting up Azure OpenAI embedder in Meilisearch',
      status: 'pending',
      details: '',
    },
    {
      name: 'Ingest Documents',
      script: path.join(__dirname, 'ingest.mjs'),
      description: 'Ingesting 768+ documents (this takes 5-10 minutes)',
      status: 'pending',
      details: '',
    },
    {
      name: 'Configure Synonyms',
      script: path.join(__dirname, 'setup-synonyms.mjs'),
      description: 'Configuring 32 synonym groups for better search',
      status: 'pending',
      details: '(32 groups)',
    },
    {
      name: 'Verify Setup',
      script: path.join(__dirname, 'check-meili.mjs'),
      description: 'Checking Meilisearch index and document count',
      status: 'pending',
      details: '',
    },
  ];

  // Pre-flight checks
  log('\n🔍 Pre-flight checks...\n', colors.blue);

  // Check 1: Docker
  log('   Checking Docker...', colors.yellow);
  const dockerRunning = await checkDocker();
  if (!dockerRunning) {
    log('   ✗ Docker is not running', colors.red);
    log(
      '\n❌ Please start Docker Desktop and try again.\n',
      colors.red,
    );
    process.exit(1);
  }
  log('   ✓ Docker is running', colors.green);

  // Check 2: Meilisearch
  log('   Checking Meilisearch...', colors.yellow);
  const meilisearchRunning = await checkMeilisearch();
  if (!meilisearchRunning) {
    log('   → Starting Meilisearch container...', colors.yellow);
    try {
      const started = await startMeilisearch();
      if (!started) {
        throw new Error('Meilisearch failed to start within 30 seconds');
      }
      log('   ✓ Meilisearch started', colors.green);
    } catch (error) {
      log(`   ✗ Failed to start Meilisearch: ${error.message}`, colors.red);
      process.exit(1);
    }
  } else {
    log('   ✓ Meilisearch is running', colors.green);
  }

  // Check 3: Environment files exist
  log('   Checking environment files...', colors.yellow);
  const aiEnvPath = path.resolve(__dirname, '../.ai-env');
  const meilisearchEnvPath = path.resolve(
    __dirname,
    '../../../infra/meilisearch/.env',
  );

  if (!fs.existsSync(meilisearchEnvPath)) {
    log('   ✗ Missing infra/meilisearch/.env', colors.red);
    log(
      '\n❌ Setup incomplete: Copy infra/meilisearch/.env.example to .env and set MEILI_MASTER_KEY\n',
      colors.red,
    );
    process.exit(1);
  }

  if (!fs.existsSync(aiEnvPath)) {
    log('   ✗ Missing apps/ai-api/.ai-env', colors.red);
    log(
      '\n❌ Setup incomplete: Copy apps/ai-api/.ai-env.example to .ai-env and set Azure credentials\n',
      colors.red,
    );
    process.exit(1);
  }
  log('   ✓ Environment files exist', colors.green);

  // Check 4: Required environment variables
  log('   Checking required variables...', colors.yellow);
  const meilisearchEnvContent = fs.readFileSync(meilisearchEnvPath, 'utf8');
  const aiEnvContent = fs.readFileSync(aiEnvPath, 'utf8');

  // Check Meilisearch master key
  const masterKeyMatch = meilisearchEnvContent.match(/MEILI_MASTER_KEY=(.+)/);
  if (
    !masterKeyMatch ||
    masterKeyMatch[1].includes('CHANGE_ME') ||
    masterKeyMatch[1].trim().length < 16
  ) {
    log('   ✗ MEILI_MASTER_KEY missing or invalid', colors.red);
    log(
      '\n❌ [MEILI_MASTER_KEY] missing in [infra/meilisearch/.env]',
      colors.red,
    );
    log('   Set a random secret of ~64 characters\n', colors.yellow);
    process.exit(1);
  }

  // Check Azure credentials
  const requiredAzureVars = [
    { key: 'AZURE_KEY', pattern: /AZURE_KEY=(.+)/ },
    { key: 'AZURE_ENDPOINT', pattern: /AZURE_ENDPOINT=(.+)/ },
    { key: 'AZURE_EMBEDDING_DEPLOY_SMALL', pattern: /AZURE_EMBEDDING_DEPLOY_SMALL=(.+)/ },
    { key: 'AZURE_GPT_DEPLOY', pattern: /AZURE_GPT_DEPLOY=(.+)/ },
  ];

  for (const { key, pattern } of requiredAzureVars) {
    const match = aiEnvContent.match(pattern);
    if (!match || match[1].includes('REPLACE') || match[1].includes('provided') || match[1].trim().length === 0) {
      log(`   ✗ ${key} missing or invalid`, colors.red);
      log(`\n❌ [${key}] missing in [apps/ai-api/.ai-env]`, colors.red);
      log('   Set your Azure OpenAI credentials\n', colors.yellow);
      process.exit(1);
    }
  }
  log('   ✓ All required variables set', colors.green);

  // Check 5: API Keys (generate if needed)
  log('   Checking API keys...', colors.yellow);
  const needsKeys =
    aiEnvContent.includes('REPLACE_WITH_CREATED_ADMIN_KEY') ||
    aiEnvContent.includes('REPLACE_WITH_CREATED_SEARCH_KEY');
  if (needsKeys) {
    log('   → Generating API keys...', colors.yellow);
    try {
      await generateApiKeys();
      log('   ✓ API keys generated and saved to .ai-env', colors.green);
    } catch (error) {
      log(`   ✗ Failed to generate keys: ${error.message}`, colors.red);
      process.exit(1);
    }
  } else {
    log('   ✓ API keys configured', colors.green);
  }

  log('\n✅ All pre-flight checks passed!\n', colors.green);

  const startTime = Date.now();
  let failedStep = null;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    logStep(i + 1, steps.length, step.name);
    log(`   ${step.description}`, colors.yellow);

    try {
      await runScript(step.script);
      step.status = 'success';
      log(`   ✓ ${step.name} completed`, colors.green);
    } catch (error) {
      step.status = 'failed';
      step.error = error.message;
      failedStep = i;
      log(`   ✗ ${step.name} failed: ${error.message}`, colors.red);
      log('\n❌ Setup failed. Please check the error above.\n', colors.red);

      // Mark remaining steps as skipped
      for (let j = i + 1; j < steps.length; j++) {
        steps[j].status = 'skipped';
      }
      break;
    }
  }

  const duration = Math.round((Date.now() - startTime) / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  // Display summary
  if (failedStep === null) {
    log(
      '\n╔════════════════════════════════════════════════════════════╗',
      colors.green,
    );
    log(
      '║          ✓ Setup Complete!                                ║',
      colors.green,
    );
    log(
      '╚════════════════════════════════════════════════════════════╝',
      colors.green,
    );
    log(`\n   Time taken: ${minutes}m ${seconds}s\n`, colors.bright);
  }

  // Print summary
  log('📋 Setup Summary:', colors.bright);
  for (const step of steps) {
    if (step.status === 'success') {
      log(
        `   ✅ ${step.name}${step.details ? ' ' + step.details : ''}`,
        colors.green,
      );
    } else if (step.status === 'failed') {
      log(`   ❌ ${step.name} - FAILED`, colors.red);
    } else if (step.status === 'skipped') {
      log(`   ⏭️  ${step.name} - SKIPPED`, colors.yellow);
    }
  }

  if (failedStep !== null) {
    log("\nPlease fix the error and run 'pnpm run setup' again.\n", colors.red);
    process.exit(1);
  }

  log('\nNext steps:', colors.bright);
  log('  1. Start AI API:    pnpm run dev', colors.yellow);
  log('  2. Start frontend:  pnpm run www (from repo root)', colors.yellow);
  log('  3. Open browser:    http://localhost:5173\n', colors.yellow);
}

main().catch((error) => {
  log(`\n❌ Setup failed: ${error.message}\n`, colors.red);
  process.exit(1);
});
