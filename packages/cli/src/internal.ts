/** Export internal utilities for use in other Designsystemet apps */

export {
  FIGMA_COLLECTION,
  type FigmaCollections,
  type FigmaMode,
  mergeTokenSets,
  type SelectedTokenSet,
  type ThemeObjectInput,
  toFigmaCollections,
  UNGROUPED,
} from './figma/collections.ts';
export {
  type FigmaVariableScope,
  type FigmaVariableToken,
  type FigmaVariableType,
  figmaVariableScopes,
  figmaVariableType,
  isPrivateTokenPath,
} from './figma/scopes.ts';
export { getThemeColorScales } from './tokens/create/generators/primitives/color-scheme.ts';
export { cssVariableName } from './tokens/css-variables.ts';
