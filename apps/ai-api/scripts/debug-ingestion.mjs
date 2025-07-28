#!/usr/bin/env node
// Debug ingestion to see what document structure is actually being created

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
const REPO_ROOT = path.resolve(__dirname, '../../..');
const INDEX_NAME = env.MEILISEARCH_PROJECT_NAME || 'designsystemet-search';

// Copy relevant functions from ingest.mjs to test locally
function extractLanguageFromPath(filePath) {
  if (filePath.includes('/en/')) return 'en';
  if (filePath.includes('/no/')) return 'no';
  return 'en'; // default to English
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
  
  // Default fallback
  return { title: path.basename(filePath, ext), content: content.trim(), lang };
}

function generateUrl(filePath) {
  const relativePath = path.relative(REPO_ROOT, filePath);
  
  // Component documentation -> Storybook
  if (relativePath.includes('packages/react/src/components/')) {
    const componentName = relativePath.split('/').slice(-2, -1)[0];
    return `https://storybook.designsystemet.no/?path=/docs/komponenter-${componentName.toLowerCase()}--docs`;
  }
  
  // Utilities -> Storybook
  if (relativePath.includes('packages/react/src/utilities/')) {
    const utilityName = relativePath.split('/').slice(-2, -1)[0];
    return `https://storybook.designsystemet.no/?path=/docs/utilities-${utilityName.toLowerCase()}--docs`;
  }
  
  // Website content -> designsystemet.no
  if (relativePath.includes('apps/www/app/content/')) {
    const contentPath = relativePath.replace('apps/www/app/content/', '');
    return `https://designsystemet.no/content/${contentPath}`;
  }
  
  // Fallback
  return `https://designsystemet.no/${relativePath}`;
}

function chunkText(text, maxTokens = 300) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  const chunks = [];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    const potentialChunk = currentChunk + sentence + '.';
    if (potentialChunk.length > maxTokens * 4 && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence + '.';
    } else {
      currentChunk = potentialChunk;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.length > 0 ? chunks : [text];
}

async function debugIngestion() {
  try {
    console.log('🔍 Debugging ingestion document structure...\n');
    
    // Test with a single Button component file
    const testFilePath = path.resolve(REPO_ROOT, 'packages/react/src/components/Button/Button.mdx');
    
    console.log(`📁 Testing with file: ${testFilePath}`);
    console.log(`📂 File exists: ${fs.existsSync(testFilePath)}`);
    
    if (fs.existsSync(testFilePath)) {
      // Process the Button.mdx file
      const content = fs.readFileSync(testFilePath, 'utf8');
      const { title, content: extractedContent, lang } = extractTextFromFile(testFilePath, content);
      
      console.log('\n📊 Extracted data:');
      console.log(`  Title: ${title}`);
      console.log(`  Lang: ${lang}`);
      console.log(`  Content length: ${extractedContent.length}`);
      console.log(`  Content preview: ${extractedContent.substring(0, 100)}...`);
      
      // Create chunks
      const chunks = chunkText(extractedContent);
      console.log(`  Chunk count: ${chunks.length}`);
      
      // Generate document structure
      const url = generateUrl(testFilePath);
      const relativePath = path.relative(REPO_ROOT, testFilePath);
      
      console.log(`  URL: ${url}`);
      console.log(`  Relative path: ${relativePath}`);
      
      // Create document like the ingestion script does
      const document = {
        id: crypto.createHash('md5').update(testFilePath + chunks[0] + 0).digest('hex'),
        title: chunks.length > 1 ? `${title} (Part 1)` : title,
        content: chunks[0],
        url,
        file_path: relativePath,
        lang,
        type: relativePath.includes('components/') ? 'component' : 
              relativePath.includes('design-tokens/') ? 'design-token' :
              relativePath.includes('figma/') ? 'figma' :
              relativePath.includes('themebuilder/') ? 'themebuilder' :
              relativePath.includes('best-practices/') ? 'best-practice' :
              'general',
        vector: null, // Skip embedding for debugging
      };
      
      console.log('\n📄 Document structure:');
      console.log(JSON.stringify(document, null, 2));
      
      return;
    } else if (!fs.existsSync(testFilePath)) {
      console.log('❌ Test file not found, looking for alternatives...');
      
      // Find a component directory
      const componentsDir = path.resolve(REPO_ROOT, 'packages/react/src/components');
      const componentDirs = fs.readdirSync(componentsDir).filter(name => {
        const fullPath = path.join(componentsDir, name);
        return fs.statSync(fullPath).isDirectory();
      });
      
      console.log(`📂 Found component directories: ${componentDirs.slice(0, 3).join(', ')}`);
      
      if (componentDirs.length > 0) {
        const buttonDir = path.join(componentsDir, 'Button');
        console.log(`🎯 Testing with Button directory: ${buttonDir}`);
        
        // List files in Button directory
        const buttonFiles = fs.readdirSync(buttonDir);
        console.log(`📄 Files in Button directory: ${buttonFiles.join(', ')}`);
        
        // Find an MDX file
        const mdxFile = buttonFiles.find(f => f.endsWith('.mdx'));
        if (mdxFile) {
          const mdxPath = path.join(buttonDir, mdxFile);
          console.log(`📝 Testing with MDX file: ${mdxPath}`);
          
          // Process this file
          const content = fs.readFileSync(mdxPath, 'utf8');
          const { title, content: extractedContent, lang } = extractTextFromFile(mdxPath, content);
          
          console.log('\n📊 Extracted data:');
          console.log(`  Title: ${title}`);
          console.log(`  Lang: ${lang}`);
          console.log(`  Content length: ${extractedContent.length}`);
          console.log(`  Content preview: ${extractedContent.substring(0, 100)}...`);
          
          // Create chunks
          const chunks = chunkText(extractedContent);
          console.log(`  Chunk count: ${chunks.length}`);
          
          // Generate document structure
          const url = generateUrl(mdxPath);
          const relativePath = path.relative(REPO_ROOT, mdxPath);
          
          console.log(`  URL: ${url}`);
          console.log(`  Relative path: ${relativePath}`);
          
          // Create document like the ingestion script does
          const document = {
            id: crypto.createHash('md5').update(mdxPath + chunks[0] + 0).digest('hex'),
            title: chunks.length > 1 ? `${title} (Part 1)` : title,
            content: chunks[0],
            url,
            file_path: relativePath,
            lang,
            type: relativePath.includes('components/') ? 'component' : 
                  relativePath.includes('design-tokens/') ? 'design-token' :
                  relativePath.includes('figma/') ? 'figma' :
                  relativePath.includes('themebuilder/') ? 'themebuilder' :
                  relativePath.includes('best-practices/') ? 'best-practice' :
                  'general',
            vector: null, // Skip embedding for debugging
          };
          
          console.log('\n📄 Document structure:');
          console.log(JSON.stringify(document, null, 2));
          
          return;
        }
      }
    }
    
    console.log('❌ Could not find suitable test file');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugIngestion();
