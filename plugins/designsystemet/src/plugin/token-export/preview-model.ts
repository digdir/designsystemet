import {
  FIGMA_COLLECTION,
  type FigmaCollections,
  type FigmaMode,
  toFigmaCollections,
} from '@digdir/designsystemet/tokens/create';
import { findReferences, flattenTokens } from './parser';
import { findUnresolvedReferences } from './resolver';
import type {
  CollectionPreview,
  FlatToken,
  ModePreview,
  ThemeOption,
  TokenInput,
  TokenModel,
} from './types';
import { inferVariableName, pathToFigmaName } from './utils';
import { mapTokenTypeToVariableType } from './variable-values';

// Builds the export-side model used by the Figma importer and the resolver.
// This stays on the plugin side; the UI previews from the validated config.
export function buildTokenModel({
  tokenSets,
  $themes,
}: TokenInput): TokenModel {
  const warnings: string[] = [];

  if ($themes.length === 0) {
    warnings.push(
      'No $themes entries. Preview cannot group modes from token sets.',
    );
  }

  const tokenSetPaths = Array.from(tokenSets.keys());

  const flatTokens: FlatToken[] = [];
  for (const [tokenSetPath, tokenSet] of tokenSets) {
    for (const token of flattenTokens(tokenSet)) {
      flatTokens.push({
        tokenSet: tokenSetPath,
        path: token.path,
        figmaName: pathToFigmaName(token.path),
        type: token.type,
        value: token.value,
        references: findReferences(token.value),
      });
    }
  }

  // Grouping of $themes into collections/modes is done by the CLI so the
  // plugin and `designsystemet tokens` agree on it.
  const missingTokenSets = new Set<string>();
  const figmaCollections = toFigmaCollections($themes, tokenSets, {
    onMissingTokenSet: (tokenSet) => missingTokenSets.add(tokenSet),
  });

  const modePreviews: ModePreview[] = Object.entries(figmaCollections).flatMap(
    ([group, modes]) =>
      modes.map((mode) => ({
        id: mode.id,
        name: mode.modeName,
        group,
        selectedTokenSets: mode.tokenSets,
      })),
  );

  for (const mode of modePreviews) {
    const sourceCount = mode.selectedTokenSets.filter(
      (item) => item.status === 'source',
    ).length;
    if (sourceCount > 1) {
      warnings.push(
        `${mode.name}: has ${sourceCount} token sets marked as source.`,
      );
    }
  }

  const collections = buildCollectionPreview(figmaCollections, flatTokens);

  for (const tokenSet of Array.from(missingTokenSets).sort()) {
    warnings.push(
      `Token set is listed in $themes but was not generated: ${tokenSet}`,
    );
  }

  const model: TokenModel = {
    tokenSets: tokenSetPaths.map((path) => ({ path })),
    flatTokens,
    figmaCollections,
    themes: modePreviews,
    collections,
    themeOptions: buildThemeOptions(modePreviews, tokenSetPaths),
    colorSchemeOptions: buildColorSchemeOptions(modePreviews),
    warnings,
  };

  const unresolvedReferences = findUnresolvedReferences(model);
  for (const reference of unresolvedReferences.slice(0, 25)) {
    warnings.push(
      `Unresolved alias: {${reference.reference}} used in ${reference.tokenSet}/${reference.path}`,
    );
  }

  if (unresolvedReferences.length > 25) {
    warnings.push(
      `${unresolvedReferences.length - 25} more unresolved aliases hidden from preview.`,
    );
  }

  return model;
}

function buildCollectionPreview(
  figmaCollections: FigmaCollections,
  flatTokens: FlatToken[],
): CollectionPreview[] {
  return Object.entries(figmaCollections).map(([group, modes]) => ({
    name: group,
    variablePreview: inferVariablesForGroup(group, modes, flatTokens),
  }));
}

function inferVariablesForGroup(
  group: string,
  modes: FigmaMode[],
  flatTokens: FlatToken[],
): Array<{ name: string; type: string }> {
  const names = new Map<string, { name: string; type: string }>();

  for (const mode of modes) {
    for (const selected of mode.tokenSets) {
      if (!selected.exists) {
        continue;
      }

      const tokens = flatTokens.filter(
        (token) => token.tokenSet === selected.tokenSet,
      );
      for (const token of tokens) {
        const variableName = inferVariableName(group, mode.modeName, token);
        if (!names.has(variableName)) {
          names.set(variableName, {
            name: variableName,
            type: mapTokenType(token.type),
          });
        }
      }
    }
  }

  return Array.from(names.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

function buildThemeOptions(
  modePreviews: ModePreview[],
  tokenSetPaths: string[],
): ThemeOption[] {
  const themeModes = modePreviews.filter(
    (mode) => mode.group === FIGMA_COLLECTION.THEME,
  );

  if (themeModes.length > 1) {
    return themeModes.map((mode) => ({
      name: mode.name,
      tokenSets: existingTokenSets(mode),
    }));
  }

  const themeSets = tokenSetPaths
    .filter((path) => path.startsWith('themes/'))
    .map((path) => ({
      name: path.split('/').pop() || path,
      tokenSets: [path],
    }));

  if (themeSets.length > 0) {
    return themeSets;
  }

  return themeModes.map((mode) => ({
    name: mode.name,
    tokenSets: existingTokenSets(mode),
  }));
}
function buildColorSchemeOptions(modePreviews: ModePreview[]): ThemeOption[] {
  const rank = (name: string) =>
    /Light/i.test(name) ? 0 : /Dark/i.test(name) ? 2 : 1;

  return modePreviews
    .filter((mode) => mode.group === FIGMA_COLLECTION.COLOR_SCHEME)
    .map((mode) => ({
      name: mode.name,
      tokenSets: existingTokenSets(mode),
    }))
    .sort((a, b) => rank(a.name) - rank(b.name));
}

function existingTokenSets(mode: ModePreview): string[] {
  return mode.selectedTokenSets
    .filter((item) => item.exists)
    .map((item) => item.tokenSet);
}

function mapTokenType(type: string | null): string {
  const variableType = mapTokenTypeToVariableType(type);
  if (variableType) {
    return variableType;
  }

  if (type === 'typography') {
    return 'STYLE_TEXT';
  }

  if (type === 'boxShadow') {
    return 'STYLE_EFFECT';
  }

  return type || '(unknown)';
}
