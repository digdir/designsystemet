import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { z } from 'zod/v4';
import { configFileSchema } from '../config.js';

const schema = z
  .object({
    $schema: z.string().optional(),
  })
  .extend(configFileSchema.shape);

writeFile(
  resolve(import.meta.dirname, '../../dist/config.schema.json'),
  JSON.stringify(
    z.toJSONSchema(schema, {
      unrepresentable: 'any',
    }),
    undefined,
    2,
  ),
  {
    encoding: 'utf-8',
  },
);
