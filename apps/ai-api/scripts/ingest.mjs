#!/usr/bin/env node

// Ingestion script: walks repo, chunks content, embeds content, and stores in Meilisearch
// Usage: node scripts/ingest.mjs [--force] [--dry-run]

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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
    const lines = fs
      .readFileSync(p, 'utf8')
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
  // Component documentation (MDX + stories)
  'packages/react/src/components',
  // Utility/hook documentation
  'packages/react/src/utilities',
  // Design token documentation
  'apps/www/app/content/fundamentals/*/design-tokens',
  // Figma documentation
  'apps/www/app/content/fundamentals/*/figma',
  // Themebuilder documentation
  'apps/www/app/content/fundamentals/*/themebuilder',
  // Best practices documentation
  'apps/www/app/content/best-practices',
  // General website content
  'apps/www/app/content',
  // Theme CSS files
  'packages/theme/brand',
  'packages/theme/src/themes',
];
const FILE_PATTERNS = /\.(md|mdx|tsx|css)$/i;
const CHUNK_SIZE = 300;
// const CHUNK_OVERLAP = 50; // Could be used to create more context between chunks
const INDEX_NAME = env.MEILISEARCH_PROJECT_NAME || 'designsystemet-search';

// Initialize clients
const meiliClient = new Meilisearch({
  host: env.MEILISEARCH_API_URL,
  apiKey: env.MEILISEARCH_ADMIN_KEY,
});

// Helper functions
function extractLanguageFromPath(filePath) {
  // Extract language from path structure
  if (filePath.includes('/en/')) return 'en';
  if (filePath.includes('/no/')) return 'no';
  return 'en';
}

function extractTextFromFile(filePath, content) {
  const ext = path.extname(filePath).toLowerCase();
  const lang = extractLanguageFromPath(filePath);

  if (ext === '.md' || ext === '.mdx') {
    // Extract frontmatter and content
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      const body = frontmatterMatch[2];

      // Extract title from frontmatter
      const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/);
      const title = titleMatch ? titleMatch[1] : path.basename(filePath, ext);

      return { title, content: body.trim(), lang };
    }

    // No frontmatter, use first heading as title
    const headingMatch = content.match(/^#\s+(.+)$/m);
    const title = headingMatch ? headingMatch[1] : path.basename(filePath, ext);

    return { title, content: content.trim(), lang };
  }

  if (ext === '.tsx') {
    // Extract JSDoc comments and component names
    const componentMatch = content.match(
      /export\s+(?:default\s+)?(?:function|const)\s+(\w+)/,
    );
    const title = componentMatch
      ? `${componentMatch[1]} Component`
      : path.basename(filePath, ext);

    // Extract JSDoc comments
    const jsdocMatches = content.match(/\/\*\*[\s\S]*?\*\//g) || [];
    const comments = jsdocMatches
      .map((comment) => comment.replace(/\/\*\*|\*\/|\s*\*\s?/g, '').trim())
      .join('\n\n');

    return { title, content: comments || `Component: ${title}`, lang };
  }

  if (ext === '.css') {
    // Extract CSS custom properties and their values
    const customProps = content.match(/--[\w-]+:\s*[^;]+;/g) || [];
    const title = `${path.basename(filePath, ext)} Theme`;

    if (customProps.length > 0) {
      const propList = customProps.slice(0, 20).join('\n');
      const content_text = `CSS Custom Properties:\n\n${propList}\n\n${customProps.length > 20 ? `...and ${customProps.length - 20} more properties` : ''}`;
      return { title, content: content_text, lang };
    }

    return { title, content: `CSS theme file: ${title}`, lang };
  }

  return { title: path.basename(filePath, ext), content: content.trim(), lang };
}

function chunkText(text, maxTokens = CHUNK_SIZE) {
  // Simple chunking by sentences/paragraphs
  const sentences = text.split(/[.!?]\s+/).filter((s) => s.trim());
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

  if (currentChunk.trim()) chunks.push(currentChunk.trim());

  return chunks.length > 0 ? chunks : [text];
}

async function combineComponentFiles(componentDir) {
  // Combine MDX documentation with stories for a single component
  const componentName = path.basename(componentDir);
  const files = fs.readdirSync(componentDir);

  let mdxContent = '';
  let storiesContent = '';
  let title = componentName;

  // Read MDX file
  const mdxFile = files.find((f) => f.endsWith('.mdx'));
  if (mdxFile) {
    const mdxPath = path.join(componentDir, mdxFile);
    const mdxRaw = fs.readFileSync(mdxPath, 'utf8');
    const extracted = extractTextFromFile(mdxPath, mdxRaw);
    title = extracted.title;
    mdxContent = extracted.content;
  }

  // Read stories file
  const storiesFile = files.find((f) => f.endsWith('.stories.tsx'));
  if (storiesFile) {
    const storiesPath = path.join(componentDir, storiesFile);
    const storiesRaw = fs.readFileSync(storiesPath, 'utf8');

    // Extract story names and descriptions
    const storyMatches =
      storiesRaw.match(/export const (\w+)[^=]*=[\s\S]*?(?=export|Z)/g) || [];
    const stories = storyMatches
      .map((story) => {
        const nameMatch = story.match(/export const (\w+)/);
        return nameMatch ? nameMatch[1] : '';
      })
      .filter(Boolean);

    if (stories.length > 0) {
      storiesContent = `\n\nExamples:\n${stories.join(', ')}`;
    }
  }

  // Generate Storybook URL
  const storybookUrl = `https://storybook.designsystemet.no/?path=/docs/komponenter-${componentName.toLowerCase()}--docs`;

  const combinedContent = mdxContent + storiesContent;

  return {
    title: `${title} Component`,
    content: combinedContent,
    url: storybookUrl,
    lang: 'en',
    type: 'component',
  };
}

function generateUrl(filePath) {
  // Convert file path to URL
  const relativePath = path.relative(REPO_ROOT, filePath);

  if (relativePath.startsWith('packages/react/src/components/')) {
    // Component files are handled by combineComponentFiles - this shouldn't be called for them
    const componentName = relativePath.split('/')[4];
    return `https://storybook.designsystemet.no/?path=/docs/komponenter-${componentName?.toLowerCase()}--docs`;
  }

  if (relativePath.startsWith('packages/react/src/utilities/')) {
    // Utility/hook documentation
    const utilityName = relativePath.split('/').slice(-2, -1)[0];
    return `https://storybook.designsystemet.no/?path=/docs/utilities-${utilityName?.toLowerCase()}--docs`;
  }

  if (relativePath.startsWith('packages/theme/')) {
    // Theme CSS files
    return `https://designsystemet.no/en/fundamentals/design-tokens/colors`;
  }

  if (relativePath.startsWith('apps/www/app/content/')) {
    // Website content
    const urlPath = relativePath
      .replace('apps/www/app/content/', '')
      .replace(/\.(md|mdx)$/, '')
      .replace('/index', '');

    return `https://designsystemet.no/${urlPath}`;
  }

  // Fallback
  return `https://designsystemet.no/`;
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
    throw new Error(
      `Embedding failed: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data.data[0].embedding;
}

async function processFile(filePath, dryRun = false) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const {
      title,
      content: extractedContent,
      lang,
    } = extractTextFromFile(filePath, content);

    if (!extractedContent || extractedContent.trim().length < 50) {
      return [];
    }

    const chunks = chunkText(extractedContent);
    const url = generateUrl(filePath);
    const relativePath = path.relative(REPO_ROOT, filePath);

    // Generate embeddings for all chunks if not dry run
    const vectors = dryRun
      ? []
      : await Promise.all(chunks.map((chunk) => embedText(chunk)));

    const documents = chunks.map((chunk, index) => {
      const id = crypto
        .createHash('md5')
        .update(filePath + chunk + index)
        .digest('hex');

      return {
        id,
        title: title,
        content: chunk,
        url,
        file_path: relativePath,
        lang,
        type: relativePath.includes('components/')
          ? 'component'
          : relativePath.includes('design-tokens/')
            ? 'design-token'
            : relativePath.includes('figma/')
              ? 'figma'
              : relativePath.includes('themebuilder/')
                ? 'themebuilder'
                : relativePath.includes('best-practices/')
                  ? 'best-practice'
                  : 'general',
        // Metadata for chunk tracking (doesn't affect search quality)
        part_index: chunks.length > 1 ? index + 1 : null,
        total_parts: chunks.length > 1 ? chunks.length : null,
        // Use _vectors with embedder name for Meilisearch
        _vectors: dryRun
          ? null
          : {
              [process.env.MEILISEARCH_EMBEDDER_UID || 'azure-openai-small']:
                vectors[index],
            },
      };
    });

    if (!dryRun) {
      console.log(`  ✓ ${title} (${chunks.length} chunks, ${lang})`);
    }

    return documents;
  } catch (error) {
    console.error(`  ✗ Error processing ${filePath}:`, error.message);
    return [];
  }
}

async function processComponentDirectory(componentDir, dryRun = false) {
  try {
    const combinedData = await combineComponentFiles(componentDir);

    if (!combinedData.content || combinedData.content.trim().length < 50)
      return [];

    const chunks = chunkText(combinedData.content);
    const relativePath = path.relative(REPO_ROOT, componentDir);

    // Generate embeddings for all chunks if not dry run
    const vectors = dryRun
      ? []
      : await Promise.all(chunks.map((chunk) => embedText(chunk)));

    const documents = chunks.map((chunk, index) => {
      const id = crypto
        .createHash('md5')
        .update(componentDir + chunk + index)
        .digest('hex');

      return {
        id,
        title: combinedData.title,
        chunk_part: chunks.length > 1 ? index + 1 : null,
        total_chunks: chunks.length > 1 ? chunks.length : null,
        content: chunk,
        url: combinedData.url,
        file_path: relativePath,
        lang: combinedData.lang,
        type: 'component',
        _vectors: dryRun
          ? null
          : {
              [process.env.MEILISEARCH_EMBEDDER_UID || 'azure-openai-small']:
                vectors[index],
            },
      };
    });

    if (!dryRun) {
      console.log(
        `  ✓ ${combinedData.title} (${chunks.length} chunks, combined)`,
      );
    }

    return documents;
  } catch (error) {
    console.error(
      `  ✗ Error processing component directory ${componentDir}:`,
      error.message,
    );
    return [];
  }
}

async function walkDirectory(dir) {
  const files = [];
  const componentDirs = [];

  function walk(currentDir) {
    if (!fs.existsSync(currentDir)) return;

    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (
        entry.isDirectory() &&
        !entry.name.startsWith('.') &&
        entry.name !== 'node_modules'
      ) {
        // Check if this is a component directory (has both .mdx and .stories.tsx)
        if (currentDir.includes('packages/react/src/components')) {
          const dirFiles = fs.readdirSync(fullPath);
          const hasMdx = dirFiles.some((f) => f.endsWith('.mdx'));
          const hasStories = dirFiles.some((f) => f.endsWith('.stories.tsx'));

          if (hasMdx && hasStories) {
            componentDirs.push(fullPath);
            continue;
          }
        }

        walk(fullPath);
      } else if (entry.isFile() && FILE_PATTERNS.test(entry.name)) {
        // Skip individual component files if they're in a component directory
        const isComponentFile =
          fullPath.includes('packages/react/src/components') &&
          (entry.name.endsWith('.mdx') || entry.name.endsWith('.stories.tsx'));
        if (!isComponentFile) {
          files.push(fullPath);
        }
      }
    }
  }

  walk(dir);
  return { files, componentDirs };
}

async function setupIndex() {
  try {
    // Try to get existing index
    await meiliClient.getIndex(INDEX_NAME);
    console.log(`📊 Using existing index: ${INDEX_NAME}`);
  } catch (_error) {
    // On error, create new index
    console.log(`📊 Creating new index: ${INDEX_NAME}`);
    await meiliClient.createIndex(INDEX_NAME, { primaryKey: 'id' });

    // Wait for index creation
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const index = meiliClient.index(INDEX_NAME);

  // Configure index settings
  await index.updateSettings({
    searchableAttributes: ['title', 'content'],
    displayedAttributes: ['id', 'title', 'url', 'content', 'file_path'],
    filterableAttributes: ['file_path'],
    sortableAttributes: ['title'],
    // Note: synonyms are managed by setup-synonyms.mjs, synonyms are not affected by running the ingest script
  });

  console.log(`⚙️  Index settings updated`);
  return index;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const testMode = args.includes('--test');

  console.log(`🚀 Starting enhanced ingestion ${dryRun ? '(dry run)' : ''}`);
  console.log(`📁 Repo root: ${REPO_ROOT}`);

  // Collect all files and component directories
  const allFiles = [];
  const allComponentDirs = [];

  for (const dir of CONTENT_DIRS) {
    const fullDir = path.join(REPO_ROOT, dir);
    if (fullDir.includes('*')) {
      // Handle glob patterns for language-specific directories
      const basePath = fullDir.split('*')[0];
      const suffix = fullDir.split('*')[1];

      for (const lang of ['en', 'no']) {
        const langDir = basePath + lang + suffix;
        if (fs.existsSync(langDir)) {
          const { files, componentDirs } = await walkDirectory(langDir);
          allFiles.push(...files);
          allComponentDirs.push(...componentDirs);
          console.log(
            `📂 Found ${files.length} files and ${componentDirs.length} component dirs in ${lang}${suffix}`,
          );
        }
      }
    } else if (fs.existsSync(fullDir)) {
      const { files, componentDirs } = await walkDirectory(fullDir);
      allFiles.push(...files);
      allComponentDirs.push(...componentDirs);
      console.log(
        `📂 Found ${files.length} files and ${componentDirs.length} component dirs in ${dir}`,
      );
    }
  }

  console.log(`📄 Total files to process: ${allFiles.length}`);
  console.log(
    `📦 Total component directories to process: ${allComponentDirs.length}`,
  );

  // In test mode, only process first 3 files and 3 component dirs
  const filesToProcess = testMode ? allFiles.slice(0, 3) : allFiles;
  const componentDirsToProcess = testMode
    ? allComponentDirs.slice(0, 3)
    : allComponentDirs;

  if (testMode) {
    console.log(
      `🧪 Test mode: processing only ${filesToProcess.length} files and ${componentDirsToProcess.length} component dirs`,
    );
  }

  if (!dryRun) {
    // Setup Meilisearch index
    const index = await setupIndex();

    // Process files and collect documents
    const allDocuments = [];

    // Process individual files
    for (const filePath of filesToProcess) {
      const documents = await processFile(filePath, dryRun);
      allDocuments.push(...documents);
    }

    // Process component directories (combine MDX + stories)
    for (const componentDir of componentDirsToProcess) {
      const documents = await processComponentDirectory(componentDir, dryRun);
      allDocuments.push(...documents);
    }

    if (allDocuments.length > 0) {
      console.log(
        `📤 Uploading ${allDocuments.length} documents to Meilisearch...`,
      );
      const task = await index.addDocuments(allDocuments);
      console.log(`✅ Upload task queued: ${task.taskUid}`);
    }
  } else {
    // Dry run: just show what would be processed
    let totalChunks = 0;
    const samplesToShow = testMode ? filesToProcess : allFiles.slice(0, 3);
    const componentSamplesToShow = testMode
      ? componentDirsToProcess
      : allComponentDirs.slice(0, 3);

    console.log('\n📄 Sample files:');
    for (const filePath of samplesToShow) {
      const documents = await processFile(filePath, true);
      totalChunks += documents.length;

      if (documents.length > 0) {
        console.log(`   → ${documents[0].title} (${documents[0].lang})`);
        console.log(`   → ${documents[0].url}`);
        console.log(`   → ${documents[0].content.substring(0, 100)}...`);
        console.log('');
      }
    }

    console.log('\n📦 Sample component directories:');
    for (const componentDir of componentSamplesToShow) {
      const documents = await processComponentDirectory(componentDir, true);
      totalChunks += documents.length;

      if (documents.length > 0) {
        console.log(`   → ${documents[0].title} (${documents[0].lang})`);
        console.log(`   → ${documents[0].url}`);
        console.log(`   → ${documents[0].content.substring(0, 100)}...`);
        console.log('');
      }
    }

    if (!testMode) {
      const fileEstimate =
        totalChunks * (allFiles.length / Math.max(samplesToShow.length, 1));
      const componentEstimate =
        totalChunks *
        (allComponentDirs.length / Math.max(componentSamplesToShow.length, 1));
      console.log(
        `📊 Would create ~${Math.round(fileEstimate + componentEstimate)} total chunks`,
      );
    } else {
      console.log(`📊 Would create ${totalChunks} total chunks`);
    }
  }

  console.log('🎉 Enhanced ingestion complete!');
}

// Run the script
main().catch((error) => {
  console.error('💥 Ingestion failed:', error);
  process.exit(1);
});
