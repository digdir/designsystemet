import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { z } from 'zod';
import { VERSIONED_SCHEMA_FILE } from '../schemas/config-version.ts';
import { externalConfigSchema } from '../schemas/schema.ts';

const schema = z
  .object({
    $schema: z.string().optional(),
  })
  .extend(externalConfigSchema.shape);

const jsonSchema = JSON.stringify(
  z.toJSONSchema(schema, {
    // The JSON schema validates what users write in the config file,
    // i.e. the pre-transform input: defaulted fields are optional.
    io: 'input',
    unrepresentable: 'any',
  }),
  undefined,
  2,
);

// The versioned file is the one configs should point to: the CLI reads the config version from its name.
// The unversioned file is kept for configs that haven't been migrated.
for (const file of ['config.schema.json', VERSIONED_SCHEMA_FILE]) {
  writeFile(resolve(import.meta.dirname, '../../dist', file), jsonSchema, { encoding: 'utf-8' });
}
