/**
 * @deprecated The versioned schema files are kept as re-exports for backwards compatibility.
 * Import from `@digdir/designsystemet/schemas/schema.js` instead.
 */
export {
  type ColorOverrideSchema,
  type ExternalConfigSchema as CreateConfigSchema,
  type ExternalConfigSchemaInput as CreateConfigSchemaInput,
  type ExternalConfigSchemaTheme as ConfigSchemaTheme,
  externalConfigSchema as configFileCreateSchema,
  overridesSchema,
} from '../schema.ts';
