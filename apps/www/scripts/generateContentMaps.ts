import { promises as fs } from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';

const CONTENT_DIR = path.join(process.cwd(), 'app', 'content');
const OUTPUT_FILE = path.join(
  process.cwd(),
  'app',
  '_utils',
  'contentMap.generated.ts',
);

async function getFileContent(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, 'utf-8');
  return content;
}

async function generateContentMaps() {
  console.log('Generating content maps...');
  const contentMap: Record<string, { content: string }> = {};
  const directoryMap: Record<string, string[]> = {};

  // Find all files in the content directory
  const files = glob.sync('**/*', {
    cwd: CONTENT_DIR,
    nodir: true,
    absolute: true,
  });

  // Also track directories
  const directories = new Set<string>();

  // Process each file
  for (const file of files) {
    const relativePath = path.relative(CONTENT_DIR, file).replace(/\\/g, '/');
    const dirPath = path.dirname(relativePath);

    if (dirPath !== '.') {
      directories.add(dirPath);
    }

    const content = await getFileContent(file);
    contentMap[relativePath] = { content };

    // Keep track of which files are in each directory
    const dirArray = dirPath === '.' ? [] : dirPath.split('/');
    let currentPath = '';

    // Add the file to the current directory
    if (!directoryMap[dirPath]) {
      directoryMap[dirPath] = [];
    }
    directoryMap[dirPath].push(path.basename(file));

    // Also add to parent directories
    for (let i = 0; i < dirArray.length; i++) {
      const segment = dirArray[i];
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;

      if (!directoryMap[currentPath]) {
        directoryMap[currentPath] = [];
      }

      // Add subdirectories to parent directories
      if (i < dirArray.length - 1) {
        const nextSegment = dirArray[i + 1];
        const subDir = `${currentPath}/${nextSegment}`;
        if (!directoryMap[currentPath].includes(nextSegment)) {
          directoryMap[currentPath].push(nextSegment);
        }
      }
    }
  }

  // Add the root directory files
  directoryMap[''] = glob.sync('*', {
    cwd: CONTENT_DIR,
    nodir: false,
  });

  // Generate the output file
  const output = `// This file is auto-generated during the build process - DO NOT EDIT MANUALLY
// Generated on: ${new Date().toISOString()}

export const contentMap = ${JSON.stringify(contentMap, null, 2)};

export const directoryMap = ${JSON.stringify(directoryMap, null, 2)};
`;

  await fs.writeFile(OUTPUT_FILE, output, 'utf-8');
  console.log(
    `Content maps generated with ${Object.keys(contentMap).length} files and ${Object.keys(directoryMap).length} directories.`,
  );
}

// Run the generator
generateContentMaps().catch((err) => {
  console.error('Error generating content maps:', err);
  process.exit(1);
});
