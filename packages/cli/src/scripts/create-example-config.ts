import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import config from './../../../../designsystemet.config.json' with { type: 'json' };
import { configObjectSchema } from '../schemas/internal/schema.ts';

// Regenerates example-config.json: the internal schema's default state, produced by parsing a
// minimal config containing only the fields without defaults (theme colors and outDir).
const exampleConfig = configObjectSchema.parse(config);

writeFile(
  resolve(import.meta.dirname, '../../docs/designsystemet.config.defaults.json'),
  `${JSON.stringify(exampleConfig, undefined, 2)}\n`,
  {
    encoding: 'utf-8',
  },
);
