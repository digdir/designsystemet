import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import config from './../../../../designsystemet.config.json' with { type: 'json' };
import { configObjectSchema } from '../schemas/schema.ts';

// Regenerates the internal schema's default state while retaining the required theme colors.
const exampleConfig = configObjectSchema.parse({ themes: config.themes });

writeFile(
  resolve(import.meta.dirname, '../../docs/designsystemet.config.defaults.json'),
  `${JSON.stringify(exampleConfig, undefined, 2)}\n`,
  {
    encoding: 'utf-8',
  },
);
