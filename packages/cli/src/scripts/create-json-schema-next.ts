import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { z } from 'zod';
import { nextConfigSchema } from '../schemas/next/schema.ts';

const schema = z
  .object({
    $schema: z.string().optional(),
  })
  .extend(nextConfigSchema.shape);

writeFile(
  resolve(import.meta.dirname, '../../dist/config-next.schema.json'),
  JSON.stringify(
    z.toJSONSchema(schema, {
      // The JSON schema validates what users write in the config file,
      // i.e. the pre-transform input: shorthands allowed, defaulted fields optional.
      io: 'input',
      unrepresentable: 'any',
    }),
    undefined,
    2,
  ),
  {
    encoding: 'utf-8',
  },
);
