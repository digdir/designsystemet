import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

type StoryEntry = {
  name: string;
  code: string;
  file: string;
};

// Extract exported story functions from *.stories.tsx
export const extractStories = (
  componentDir: string,
  dodont?: boolean,
): StoryEntry[] => {
  try {
    if (!existsSync(componentDir)) return [];
    const variant = dodont ? '.dodont.tsx' : '.stories.tsx';
    const files = readdirSync(componentDir).filter((f) => f.endsWith(variant));
    if (files.length === 0) return [];

    const extractExportedFunctions = (
      source: string,
    ): { name: string; code: string }[] => {
      const results: { name: string; code: string }[] = [];
      const funcDeclRe =
        /export\s+function\s+([A-Za-z0-9_]+)\s*\([^)]*\)\s*\{[\s\S]*?\}/g;
      const arrowBlockRe =
        /export\s+const\s+([A-Za-z0-9_]+)\s*(?::[^=]+)?=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?\};/g;
      const arrowParenRe =
        /export\s+const\s+([A-Za-z0-9_]+)\s*(?::[^=]+)?=\s*\([^)]*\)\s*=>\s*\([\s\S]*?\);/g;

      const pushMatches = (re: RegExp) => {
        for (const m of source.matchAll(re)) {
          const name = m?.[1];
          const code = m?.[0];
          if (name && code) {
            results.push({
              name,
              code: code.replace(/^\s*export\s+/, '').trim(),
            });
          }
        }
      };

      pushMatches(funcDeclRe);
      pushMatches(arrowBlockRe);
      pushMatches(arrowParenRe);
      return results;
    };

    return files.flatMap((file) => {
      const full = join(componentDir, file);
      const src = readFileSync(full, 'utf-8');
      const fns = extractExportedFunctions(src);
      return fns.map((f) => ({ ...f, file }));
    });
  } catch {
    return [];
  }
};
