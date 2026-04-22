import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { extractExportedFunctions } from './extract-stories.server';

export const getStories = async ({ path }: { path: string }) => {
  const dirname = cwd();
  const basePath = join(dirname, './app/content');

  /* check if file exists */
  if (!existsSync(join(basePath, path))) return null;
  const stats = statSync(join(basePath, path));

  try {
    if (!stats.isFile()) {
      return null;
    }

    if (stats.isDirectory()) {
      return null;
    }

    const storyContent = readFileSync(join(basePath, path), 'utf-8');

    return extractExportedFunctions(storyContent);
  } catch (_error) {
    console.error(`Error reading content from story: ${path}`);
    return null;
  }
};
