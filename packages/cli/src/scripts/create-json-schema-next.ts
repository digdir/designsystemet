import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { z } from 'zod';
import { rootConfig } from '../schemas/next/schema.ts';

const schema = z
  .object({
    $schema: z.string().optional(),
  })
  .extend(rootConfig.shape);

writeFile(
  resolve(import.meta.dirname, '../../dist/config-next.schema.json'),
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
