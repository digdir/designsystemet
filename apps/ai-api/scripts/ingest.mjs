#!/usr/bin/env node
// Ingestion script: walk repo, chunk content, embed, and store in Meilisearch
// Usage: node scripts/ingest.mjs [--force] [--dry-run]

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Meilisearch } from 'meilisearch';
import crypto from 'crypto';

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

// Configuration
const REPO_ROOT = path.resolve(__dirname, '../../..');
const CONTENT_DIRS = [
  'packages/react/src/components',
  'apps/storybook/stories',
  'apps/www/app/content',
];
const FILE_PATTERNS = /\.(md|mdx|tsx)$/i;
const CHUNK_SIZE = 300; // tokens (approximate)
const CHUNK_OVERLAP = 50;
const INDEX_NAME = env.MEILISEARCH_PROJECT_NAME || 'designsystemet-search';

// Initialize clients
const meiliClient = new Meilisearch({
  host: env.MEILISEARCH_API_URL,
  apiKey: env.MEILISEARCH_ADMIN_KEY,
});

// Helper functions
function extractTextFromFile(filePath, content) {
  const ext = path.extname(filePath).toLowerCase();
  
  if (ext === '.md' || ext === '.mdx') {
    // Extract frontmatter and content
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      const body = frontmatterMatch[2];
      
      // Extract title from frontmatter
      const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/);
      const title = titleMatch ? titleMatch[1] : path.basename(filePath, ext);
      
      return { title, content: body.trim() };
    }
    
    // No frontmatter, use first heading as title
    const headingMatch = content.match(/^#\s+(.+)$/m);
    const title = headingMatch ? headingMatch[1] : path.basename(filePath, ext);
    
    return { title, content: content.trim() };
  }
  
  if (ext === '.tsx') {
    // Extract JSDoc comments and component names
    const componentMatch = content.match(/export\s+(?:default\s+)?(?:function|const)\s+(\w+)/);
    const title = componentMatch ? `${componentMatch[1]} Component` : path.basename(filePath, ext);
    
    // Extract JSDoc comments
    const jsdocMatches = content.match(/\/\*\*[\s\S]*?\*\//g) || [];
    const comments = jsdocMatches.map(comment => 
      comment.replace(/\/\*\*|\*\/|\s*\*\s?/g, '').trim()
    ).join('\n\n');
    
    return { title, content: comments || `Component: ${title}` };
  }
  
  return { title: path.basename(filePath, ext), content: content.trim() };
}

function chunkText(text, maxTokens = CHUNK_SIZE) {
  // Simple chunking by sentences/paragraphs
  const sentences = text.split(/[.!?]\s+/).filter(s => s.trim());
  const chunks = [];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    const potentialChunk = currentChunk + (currentChunk ? '. ' : '') + sentence;
    
    // Rough token estimation (1 token ≈ 4 characters)
    if (potentialChunk.length / 4 > maxTokens && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk = potentialChunk;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.length > 0 ? chunks : [text];
}

function generateUrl(filePath) {
  // Convert file path to URL
  const relativePath = path.relative(REPO_ROOT, filePath);
  
  if (relativePath.startsWith('packages/react/src/components/')) {
    // Map component MDX files to Storybook URLs
    const componentMatch = relativePath.match(/packages\/react\/src\/components\/([^\/]+)\//);
    if (componentMatch) {
      const componentName = componentMatch[1].toLowerCase();
      return `https://storybook.designsystemet.no/?path=/docs/komponenter-${componentName}--docs`;
    }
  }
  
  if (relativePath.startsWith('apps/storybook/stories/')) {
    // Map storybook stories to storybook URLs
    const storyPath = relativePath.replace(/^apps\/storybook\/stories\//, '').replace(/\.(md|mdx)$/, '');
    return `https://storybook.designsystemet.no/?path=/docs/${storyPath.replace(/\//g, '-')}--docs`;
  }
  
  if (relativePath.startsWith('apps/www/')) {
    // Map www content to website URLs
    const contentPath = relativePath.replace(/^apps\/www\/(app|content)\//, '');
    const urlPath = contentPath.replace(/\.(md|mdx|tsx)$/, '').replace(/\/index$/, '');
    return `https://designsystemet.no/${urlPath}`;
  }
  
  // Fallback to GitHub URL
  return `https://github.com/digdir/designsystemet/blob/main/${relativePath}`;
}

async function embedText(text) {
  const url = `${env.AZURE_ENDPOINT}/openai/deployments/${env.AZURE_EMBEDDING_DEPLOY_SMALL}/embeddings?api-version=${env.AZURE_API_VERSION}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': env.AZURE_KEY,
    },
    body: JSON.stringify({ input: text }),
  });
  
  if (!response.ok) {
    throw new Error(`Embedding failed: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data[0].embedding;
}

async function processFile(filePath, dryRun = false) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { title, content: extractedContent } = extractTextFromFile(filePath, content);
    
    if (!extractedContent || extractedContent.length < 20) {
      console.log(`⏭️  Skipping ${filePath} (too short)`);
      return [];
    }
    
    const chunks = chunkText(extractedContent);
    const url = generateUrl(filePath);
    const documents = [];
    
    console.log(`📄 Processing ${filePath} → ${chunks.length} chunks`);
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkId = crypto.createHash('md5')
        .update(`${filePath}#${i}`)
        .digest('hex');
      
      if (dryRun) {
        documents.push({
          id: chunkId,
          title: i === 0 ? title : `${title} (part ${i + 1})`,
          url,
          content: chunk,
          file_path: path.relative(REPO_ROOT, filePath),
          chunk_index: i,
          // vector would be added here
        });
      } else {
        const embedding = await embedText(chunk);
        
        documents.push({
          id: chunkId,
          title: i === 0 ? title : `${title} (part ${i + 1})`,
          url,
          content: chunk,
          file_path: path.relative(REPO_ROOT, filePath),
          chunk_index: i,
          _vectors: { default: embedding },
        });
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return documents;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return [];
  }
}

async function walkDirectory(dir) {
  const files = [];
  
  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        walk(fullPath);
      } else if (entry.isFile() && FILE_PATTERNS.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

async function setupIndex() {
  try {
    // Try to get existing index
    await meiliClient.getIndex(INDEX_NAME);
    console.log(`📊 Using existing index: ${INDEX_NAME}`);
  } catch (error) {
    // Create new index
    console.log(`📊 Creating new index: ${INDEX_NAME}`);
    await meiliClient.createIndex(INDEX_NAME, { primaryKey: 'id' });
    
    // Wait for index creation
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  const index = meiliClient.index(INDEX_NAME);
  
  // Configure index settings
  await index.updateSettings({
    searchableAttributes: ['title', 'content'],
    displayedAttributes: ['id', 'title', 'url', 'content', 'file_path'],
    filterableAttributes: ['file_path'],
    sortableAttributes: ['title'],
    synonyms: {
      'autocomplete': ['combobox', 'select'],
      'dropdown': ['combobox', 'select'],
      'input': ['textfield', 'text field'],
      'button': ['btn'],
    },
  });
  
  console.log(`⚙️  Index settings updated`);
  return index;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const force = args.includes('--force');
  const testMode = args.includes('--test');
  
  console.log(`🚀 Starting ingestion ${dryRun ? '(dry run)' : ''}`);
  console.log(`📁 Repo root: ${REPO_ROOT}`);
  
  // Collect all files
  const allFiles = [];
  for (const dir of CONTENT_DIRS) {
    const fullDir = path.join(REPO_ROOT, dir);
    if (fs.existsSync(fullDir)) {
      const files = await walkDirectory(fullDir);
      allFiles.push(...files);
      console.log(`📂 Found ${files.length} files in ${dir}`);
    }
  }
  
  console.log(`📄 Total files to process: ${allFiles.length}`);
  
  // In test mode, only process first 3 files
  const filesToProcess = testMode ? allFiles.slice(0, 3) : allFiles;
  if (testMode) {
    console.log(`🧪 Test mode: processing only ${filesToProcess.length} files`);
  }
  
  if (!dryRun) {
    // Setup Meilisearch index
    const index = await setupIndex();
    
    // Process files and collect documents
    const allDocuments = [];
    for (const filePath of filesToProcess) {
      const documents = await processFile(filePath, dryRun);
      allDocuments.push(...documents);
    }
    
    if (allDocuments.length > 0) {
      console.log(`📤 Uploading ${allDocuments.length} documents to Meilisearch...`);
      const task = await index.addDocuments(allDocuments);
      console.log(`✅ Upload task queued: ${task.taskUid}`);
    }
  } else {
    // Dry run: just show what would be processed
    let totalChunks = 0;
    const samplesToShow = testMode ? filesToProcess : allFiles.slice(0, 5);
    for (const filePath of samplesToShow) {
      const documents = await processFile(filePath, true);
      totalChunks += documents.length;
      
      if (documents.length > 0) {
        console.log(`   → ${documents[0].title}`);
        console.log(`   → ${documents[0].url}`);
        console.log(`   → ${documents[0].content.substring(0, 100)}...`);
        console.log('');
      }
    }
    if (!testMode) {
      console.log(`📊 Would create ~${totalChunks * (allFiles.length / samplesToShow.length)} total chunks`);
    } else {
      console.log(`📊 Would create ${totalChunks} total chunks`);
    }
  }
  
  console.log('🎉 Ingestion complete!');
}

// Run the script
main().catch(error => {
  console.error('💥 Ingestion failed:', error);
  process.exit(1);
});
