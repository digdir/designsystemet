/**
 * @deprecated The versioned schema files are kept as re-exports for backwards compatibility.
 * Import from `@digdir/designsystemet/schemas/schema.js` instead.
 */
export {
  type ExternalConfigSchema as ConfigSchema,
  externalConfigObjectSchema as configObjectSchema,
  externalConfigSchema as configSchema,
} from '../schema.ts';
export { warnDeprecatedFields } from '../schema-output.ts';
