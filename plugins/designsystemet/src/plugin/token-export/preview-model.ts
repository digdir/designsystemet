import { COLLECTION } from './constants';
import { findReferences, flattenTokens } from './parser';
import { findUnresolvedReferences } from './resolver';
import type {
  CollectionPreview,
  FlatToken,
  LoadedFile,
  ModePreview,
  PreviewData,
  SemanticColorScale,
  ThemeOption,
} from './types';
import {
  compareByOrder,
  inferVariableName,
  isMetaFile,
  pathToFigmaName,
} from './utils';
import { mapTokenTypeToVariableType } from './variable-values';

export function buildPreview(files: LoadedFile[]): PreviewData {
  const warnings: string[] = [];

  const fileByTokenSet = new Map<string, LoadedFile>();
  for (const file of files) {
    fileByTokenSet.set(file.tokenSetPath, file);
  }

  const themesFile = files.find((file) => file.path.endsWith('$themes.json'));
  const themes = Array.isArray(themesFile?.data) ? themesFile.data : [];

  if (!themesFile) {
    warnings.push(
      'Missing $themes.json. Preview cannot group modes from token sets.',
    );
  }

  const tokenSets = files
    .filter((file) => !isMetaFile(file.path))
    .map((file) => ({
      path: file.tokenSetPath,
      tokens: flattenTokens(file.data),
    }));

  const flatTokens: FlatToken[] = [];
  const tokenLookup: Record<string, FlatToken> = {};
  for (const set of tokenSets) {
    for (const token of set.tokens) {
      const flatToken: FlatToken = {
        tokenSet: set.path,
        path: token.path,
        figmaName: pathToFigmaName(token.path),
        type: token.type,
        value: token.value,
        references: findReferences(token.value),
      };
      flatTokens.push(flatToken);
      tokenLookup[set.path + '::' + token.path] = flatToken;
    }
  }

  const modePreviews = themes.map((theme) =>
    buildModePreview(
      theme as Record<string, unknown>,
      fileByTokenSet,
      warnings,
    ),
  );

  const collections = buildCollectionPreview(modePreviews, flatTokens);

  const missingTokenSets = collectMissingTokenSets(
    themes as Array<Record<string, unknown>>,
    fileByTokenSet,
  );
  for (const tokenSet of missingTokenSets) {
    warnings.push(
      `Token set is listed in $themes.json but has no file: ${tokenSet}`,
    );
  }

  const preview: PreviewData = {
    tokenSets: tokenSets.map((set) => ({ path: set.path })),
    flatTokens,
    tokenLookup,
    themes: modePreviews,
    collections,
    themeOptions: buildThemeOptions(
      modePreviews,
      tokenSets.map((set) => set.path),
    ),
    colorSchemeOptions: buildColorSchemeOptions(modePreviews),
    semanticColorScales: buildSemanticColorScales(flatTokens, modePreviews),
    borderRadii: buildBorderRadii(flatTokens),
    fontFamilies: buildFontFamilies(flatTokens),
    warnings,
  };

  const unresolvedReferences = findUnresolvedReferences(preview);
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

  return preview;
}

function buildModePreview(
  theme: Record<string, unknown>,
  fileByTokenSet: Map<string, LoadedFile>,
  warnings: string[],
): ModePreview {
  const selectedTokenSets = (theme.selectedTokenSets || {}) as Record<
    string,
    string
  >;
  const selected = Object.keys(selectedTokenSets).map((tokenSet) => ({
    tokenSet,
    status: selectedTokenSets[tokenSet],
    exists: fileByTokenSet.has(tokenSet),
  }));

  const sourceCount = selected.filter(
    (item) => item.status === 'source',
  ).length;
  if (sourceCount > 1) {
    warnings.push(
      `${theme.name}: has ${sourceCount} token sets marked as source.`,
    );
  }

  return {
    id: typeof theme.id === 'string' ? theme.id : null,
    name: typeof theme.name === 'string' ? theme.name : '(unnamed mode)',
    group: typeof theme.group === 'string' ? theme.group : '(ungrouped)',
    selectedTokenSets: selected,
  };
}

function buildCollectionPreview(
  modePreviews: ModePreview[],
  flatTokens: FlatToken[],
): CollectionPreview[] {
  const byGroup = new Map<string, ModePreview[]>();

  for (const mode of modePreviews) {
    const current = byGroup.get(mode.group) || [];
    current.push(mode);
    byGroup.set(mode.group, current);
  }

  return Array.from(byGroup.entries()).map(([group, modes]) => ({
    name: group || '(ungrouped)',
    variablePreview: inferVariablesForGroup(group, modes, flatTokens),
  }));
}

function inferVariablesForGroup(
  group: string,
  modes: ModePreview[],
  flatTokens: FlatToken[],
): Array<{ name: string; type: string }> {
  const names = new Map<string, { name: string; type: string }>();

  for (const mode of modes) {
    for (const selected of mode.selectedTokenSets) {
      if (!selected.exists) {
        continue;
      }

      const tokens = flatTokens.filter(
        (token) => token.tokenSet === selected.tokenSet,
      );
      for (const token of tokens) {
        const variableName = inferVariableName(group, mode.name, token);
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
    (mode) => mode.group === COLLECTION.THEME,
  );

  if (themeModes.length > 1) {
    return themeModes.map((mode) => ({
      name: mode.name,
      tokenSets: existingTokenSets(mode),
    }));
  }

  const themeSets = tokenSetPaths
    .filter((path) => path.indexOf('themes/') === 0)
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
  return modePreviews
    .filter((mode) => mode.group === COLLECTION.COLOR_SCHEME)
    .map((mode) => ({
      name: mode.name,
      tokenSets: existingTokenSets(mode),
    }));
}

function existingTokenSets(mode: ModePreview): string[] {
  return mode.selectedTokenSets
    .filter((item) => item.exists)
    .map((item) => item.tokenSet);
}

function buildSemanticColorScales(
  flatTokens: FlatToken[],
  modePreviews: ModePreview[],
): SemanticColorScale[] {
  const scales = new Map<string, SemanticColorScale>();
  const scaleOrder = getSemanticColorScaleOrder(modePreviews);

  for (const token of flatTokens) {
    // Each color scale is now its own token set (semantic/color/<name>); the token
    // path inside the set is the semantic role (e.g. "background-default").
    const colorSetMatch = /^semantic\/color\/(.+)$/.exec(token.tokenSet);
    if (!colorSetMatch || token.type !== 'color') {
      continue;
    }

    const scaleName = colorSetMatch[1];
    const roleName = token.figmaName;

    if (!scales.has(scaleName)) {
      scales.set(scaleName, { name: scaleName, roles: [] });
    }

    scales.get(scaleName)?.roles.push({
      name: roleName,
      path: token.path,
      value: token.value,
    });
  }

  return Array.from(scales.values())
    .filter((scale) => scale.name !== 'focus')
    .map((scale) => ({
      name: scale.name,
      roles: scale.roles.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => compareByOrder(a.name, b.name, scaleOrder));
}

function buildBorderRadii(flatTokens: FlatToken[]) {
  return flatTokens
    .filter(
      (token) =>
        token.tokenSet === 'semantic/style' &&
        token.type === 'dimension' &&
        token.path.indexOf('border-radius.') === 0,
    )
    .map((token) => ({
      name: pathToFigmaName(token.path.replace(/^border-radius\./, '')),
      path: token.path,
      value: token.value,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// The font-family token is defined once per `themes/<name>` set, so the same path shows
// up in every theme. Dedupe on path and store a `{reference}` instead of any one theme's
// raw value — resolving the reference against the active token sets picks the selected
// theme's definition.
function buildFontFamilies(flatTokens: FlatToken[]) {
  const byPath = new Map<
    string,
    { name: string; path: string; value: string }
  >();

  for (const token of flatTokens) {
    if (
      token.type !== 'fontFamilies' ||
      (token.path !== 'font-family' && token.path.indexOf('font-family.') !== 0)
    ) {
      continue;
    }

    if (!byPath.has(token.path)) {
      byPath.set(token.path, {
        name: token.figmaName,
        path: token.path,
        value: `{${token.path}}`,
      });
    }
  }

  return Array.from(byPath.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

function getSemanticColorScaleOrder(modePreviews: ModePreview[]): string[] {
  const order = new Set<string>();

  for (const mode of modePreviews) {
    if (mode.group === COLLECTION.COLOR) {
      order.add(mode.name);
    }
  }

  for (const name of [
    'neutral',
    'success',
    'warning',
    'danger',
    'error',
    'info',
  ]) {
    order.add(name);
  }

  return Array.from(order);
}

function collectMissingTokenSets(
  themes: Array<Record<string, unknown>>,
  fileByTokenSet: Map<string, LoadedFile>,
): string[] {
  const missing = new Set<string>();

  for (const theme of themes) {
    const selectedTokenSets = (theme.selectedTokenSets || {}) as Record<
      string,
      string
    >;
    for (const tokenSet of Object.keys(selectedTokenSets)) {
      if (!fileByTokenSet.has(tokenSet)) {
        missing.add(tokenSet);
      }
    }
  }

  return Array.from(missing).sort();
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
