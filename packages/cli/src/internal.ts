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
  getLuminanceFromColor,
  type SemanticColorNames,
  semanticColorNames,
  semanticColorSpec,
  type ThemeInfo,
} from './colors/index.ts';
export { generateConfigFromCSS } from './css/generate-config-from-css.ts';
export { figmaCodeSyntax } from './figma/code-syntax.ts';
export {
  FIGMA_COLLECTION,
  type FigmaCollections,
  type FigmaMode,
  type ThemeObjectInput,
  toFigmaCollections,
} from './figma/collections.ts';
export { figmaVariableScopes, figmaVariableType } from './figma/scopes.ts';
export { flattenColors, isOldColorSchema } from './migrations/flatten-color-categories.ts';
export {
  defaultBorderRadius,
  defaultFontFamily,
  severityColors,
} from './schemas/defaults.ts';
export { parseConfig, parseJsonc, validateConfig } from './schemas/helpers.ts';
export {
  type ConfigSchema,
  configSchema,
  type ExternalConfigSchemaInput,
  externalConfigSchema,
} from './schemas/schema.ts';
export { colorNameSchema, isHexColor, themeNameSchema } from './schemas/schema-color.ts';
export {
  configColorsFromValues,
  type SchemeColors,
  type ThemeColorValues,
} from './tokens/config-colors.ts';
export { getThemeColorSchemes } from './tokens/create/generators/primitives/color-scheme.ts';
export { createSystemTokens, createTokens, getTokenSetDimensions } from './tokens/create.ts';
export { formatThemeCSS } from './tokens/format.ts';
export type { TokenSets } from './tokens/types.ts';
