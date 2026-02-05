import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

type StoryEntry = {
  name: string;
  code: string;
  file: string;
};

// Extract exported story functions from *.stories.tsx and *.dodont.tsx
export const extractStories = (
  componentPath: string,
  dodont?: boolean,
): StoryEntry[] => {
  try {
    if (!existsSync(componentPath)) return [];

    const variant = dodont ? '.dodont.tsx' : '.stories.tsx';
    const stats = statSync(componentPath);

    // Determine if it's a file or directory
    let files: string[];
    let baseDir: string;

    if (stats.isFile()) {
      // If it's a file, check if it matches the variant
      files = [basename(componentPath)];
      baseDir = dirname(componentPath);
    } else {
      // If it's a directory, filter for matching files
      files = readdirSync(componentPath).filter((f) => f.endsWith(variant));
      baseDir = componentPath;
    }

    if (files.length === 0) return [];

    const extractExportedFunctions = (
      source: string,
    ): { name: string; code: string }[] => {
      const results: { name: string; code: string }[] = [];

      // Get all positions where exports start
      const exportStarts: Array<{ index: number; name: string }> = [];
      const exportRegex = /export\s+(const|function)\s+([A-Za-z0-9_]+)/g;
      let match = exportRegex.exec(source);

      while (match !== null) {
        exportStarts.push({
          index: match.index,
          name: match[2],
        });
        match = exportRegex.exec(source);
      }

      // Process each export by looking at the text between this export and the next one
      for (let i = 0; i < exportStarts.length; i++) {
        const currentExport = exportStarts[i];
        const nextExport = exportStarts[i + 1];

        // Get the text from this export to either the next export or end of file
        const startPos = currentExport.index;
        const endPos = nextExport ? nextExport.index : source.length;
        const code = source.slice(startPos, endPos).trim();

        results.push({
          name: currentExport.name,
          code: code.replace(/^\s*export\s+/, '').trim(),
        });
      }

      return results;
    };

    return files.flatMap((file) => {
      const full = join(baseDir, file);
      const src = readFileSync(full, 'utf-8');
      const fns = extractExportedFunctions(src);
      return fns.map((f) => ({ ...f, file }));
    });
  } catch (error) {
    console.error('Error extracting stories:', error);
    return [];
  }
};
