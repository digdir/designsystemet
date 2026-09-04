import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { configFileCreateSchema } from '../schemas/internal/schema.ts';

// Regenerates example-config.json: the internal schema's default state, produced by parsing a
// minimal config containing only the fields without defaults (theme colors and outDir).
const exampleConfig = configFileCreateSchema.parse({
  outDir: 'design-tokens',
  themes: {
    theme: {
      colors: {
        accent: '#0062BA',
        neutral: '#24272B',
      },
    },
  },
});

writeFile(
  resolve(import.meta.dirname, '../../docs/defaults-config.json'),
  `${JSON.stringify(exampleConfig, undefined, 2)}\n`,
  {
    encoding: 'utf-8',
  },
);
