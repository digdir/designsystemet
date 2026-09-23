/**
 * The single entry other Designsystemet apps and packages import from (`@digdir/designsystemet/internal`).
 * The CLI itself is used through its binary; nothing here is a stable public API.
 */

export {
  type Color,
  type ColorScale,
  type ColorScheme,
  type CssColor,
  convertColor,
  generateColorSchemes,
  getContrastFromHex,
  getCssVariable,
  getLuminanceFromColor,
  RESERVED_COLORS,
  type SemanticColorNames,
  type SeverityColorNames,
  semanticColorNames,
  semanticColorSpec,
  type ThemeInfo,
} from './colors/index.ts';
export { figmaCodeSyntax } from './figma/code-syntax.ts';
export {
  FIGMA_COLLECTION,
  type FigmaCollections,
  type FigmaMode,
  type ThemeObjectInput,
  toFigmaCollections,
} from './figma/collections.ts';
export { figmaVariableScopes, figmaVariableType } from './figma/scopes.ts';
export { severityColors } from './schemas/defaults.ts';
export { parseConfig, validateConfig } from './schemas/helpers.ts';
export {
  type ConfigSchema,
  configSchema,
  type ExternalConfigSchema,
  type ExternalConfigSchemaInput,
  externalConfigSchema,
} from './schemas/schema.ts';
export { getThemeColorScales } from './tokens/create/generators/primitives/color-scheme.ts';
export { createSystemTokens, createTokens, getTokenSetDimensions } from './tokens/create.ts';
export { formatThemeCSS, formatTokens } from './tokens/format.ts';
export { deprecatedCLIOptions as cliOptions } from './schemas/helpers.ts';
export type { BorderRadiusConfig, Theme as CreateTokensOptions, TokenSets } from './tokens/types.ts';
