import { z } from 'zod';
import { externalConfigSchema } from './schema.ts';

/** The parts of a JSON schema that say which keys an object can have */
type JsonSchema = {
  properties?: Record<string, JsonSchema>;
  additionalProperties?: JsonSchema | boolean;
  items?: JsonSchema;
  anyOf?: JsonSchema[];
};

/** The schemas a value can match, with the alternatives of unions flattened */
const alternatives = (schema: JsonSchema): JsonSchema[] =>
  schema.anyOf ? schema.anyOf.flatMap(alternatives) : [schema];

function strip(value: unknown, schema: JsonSchema): unknown {
  const schemas = alternatives(schema);
  if (Array.isArray(value)) {
    const items = schemas.find((schema) => schema.items)?.items;
    return items ? value.map((item) => strip(item, items)) : value;
  }
  if (typeof value !== 'object' || value === null) return value;

  const objects = schemas.filter((schema) => schema.properties || typeof schema.additionalProperties === 'object');
  // The schema takes any value here, so there are no known keys to keep
  if (objects.length === 0) return value;

  // A key is known when any alternative of a union has it: the value is valid, so it matches one of them
  const properties: Record<string, JsonSchema> = Object.assign({}, ...objects.map((schema) => schema.properties));
  // Records, such as themes and colors, can have any key
  const rest = objects.map((schema) => schema.additionalProperties).find((rest) => typeof rest === 'object');

  return Object.fromEntries(
    Object.entries(value).flatMap(([key, child]) => {
      const known = Object.hasOwn(properties, key) ? properties[key] : rest;
      return known ? [[key, strip(child, known)]] : [];
    }),
  );
}

let schema: JsonSchema | undefined;

/**
 * Removes the keys the public config schema does not know, at every level of a config. Everything else is left
 * as it was written: nothing is transformed and no defaults are added, unlike when the config is parsed with the schema.
 *
 * The schema only rejects unknown keys in a theme. Elsewhere it ignores them, so a valid config can hold
 * any amount of data the CLI never reads. Use this before a config from outside is saved.
 * The config must already be valid according to `externalConfigSchema`.
 */
export function stripUnknownConfigKeys<T>(config: T): T {
  schema ??= z.toJSONSchema(externalConfigSchema, { io: 'input', unrepresentable: 'any' }) as JsonSchema;
  return strip(config, schema) as T;
}
