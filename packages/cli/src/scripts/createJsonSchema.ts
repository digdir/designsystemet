import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { z } from 'zod';
import { externalConfigObjectSchema } from '../schemas/schema.ts';

const schema = z
  .object({
    $schema: z.string().optional(),
  })
  .extend(externalConfigObjectSchema.shape);

writeFile(
  resolve(import.meta.dirname, '../../dist/config.schema.json'),
  JSON.stringify(
    z.toJSONSchema(schema, {
      // The JSON schema validates what users write in the config file,
      // i.e. the pre-transform input: defaulted fields are optional.
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
