import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define paths
const contentSourceDir = join(__dirname, '../app/content');
const contentTargetDir = join(__dirname, '../public/content');

// Create target directory if it doesn't exist
if (!existsSync(contentTargetDir)) {
  mkdirSync(contentTargetDir, { recursive: true });
}

// Copy content files to public directory
try {
  console.log(
    `Copying content from ${contentSourceDir} to ${contentTargetDir}...`,
  );
  cpSync(contentSourceDir, contentTargetDir, { recursive: true });
  console.log('Content files successfully copied to public directory');
} catch (error) {
  console.error('Error copying content files:', error);
  process.exit(1);
}
