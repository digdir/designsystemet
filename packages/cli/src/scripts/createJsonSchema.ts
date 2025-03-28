import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { configFileSchema } from '../config.js';

const schema = z
  .object({
    $schema: z.string().optional(),
  })
  .extend(configFileSchema.shape);

writeFile(
  resolve(import.meta.dirname, '../../dist/config.schema.json'),
  JSON.stringify(zodToJsonSchema(schema), undefined, 2),
  {
    encoding: 'utf-8',
  },
);
