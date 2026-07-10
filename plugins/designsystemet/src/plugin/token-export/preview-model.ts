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
  countBy,
  detectRootName,
  inferVariableName,
  isMetaFile,
} from './utils';

export function buildPreview(files: LoadedFile[]): PreviewData {
  const warnings: string[] = [];
  const validFiles = files.filter((file) => file.data !== null);
  const invalidFiles = files.filter((file) => file.data === null);

  for (const file of invalidFiles) {
    warnings.push(`${file.path}: ${file.error}`);
  }

  const fileByTokenSet = new Map<string, LoadedFile>();
  for (const file of validFiles) {
    fileByTokenSet.set(file.tokenSetPath, file);
  }

  const themesFile = validFiles.find((file) =>
    file.path.endsWith('$themes.json'),
  );
  const themes = Array.isArray(themesFile?.data) ? themesFile.data : [];

  if (!themesFile) {
    warnings.push(
      'Mangler $themes.json. Preview kan ikke gruppere modes fra token sets.',
    );
  }

  const tokenSets = validFiles
    .filter((file) => !isMetaFile(file.path))
    .map((file) => {
      const tokens = flattenTokens(file.data);
      return {
        path: file.tokenSetPath,
        filePath: file.path,
        tokenCount: tokens.length,
        types: countBy(tokens.map((token) => token.type || '(unknown)')),
        tokens,
      };
    });

  const flatTokens: FlatToken[] = [];
  const tokenLookup: Record<string, FlatToken> = {};
  for (const set of tokenSets) {
    for (const token of set.tokens) {
      const flatToken: FlatToken = {
        tokenSet: set.path,
        path: token.path,
        figmaName: token.path.replace(/\./g, '/'),
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
      `Token set finnes i $themes.json men mangler fil: ${tokenSet}`,
    );
  }

  const preview: PreviewData = {
    generatedAt: new Date().toISOString(),
    rootName: detectRootName(files),
    summary: {
      files: files.length,
      validFiles: validFiles.length,
      tokenSets: tokenSets.length,
      themes: 0,
      colorSchemes: 0,
      semanticColorScales: 0,
      borderRadii: 0,
      warnings: 0,
    },
    tokenSets: tokenSets.map((set) => ({
      path: set.path,
      filePath: set.filePath,
      tokenCount: set.tokenCount,
      types: set.types,
    })),
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
    warnings,
  };

  const unresolvedReferences = findUnresolvedReferences(preview);
  for (const reference of unresolvedReferences.slice(0, 25)) {
    warnings.push(
      `Uavklart alias: {${reference.reference}} brukt i ${reference.tokenSet}/${reference.path}`,
    );
  }

  if (unresolvedReferences.length > 25) {
    warnings.push(
      `${unresolvedReferences.length - 25} flere uavklarte aliaser er skjult i preview.`,
    );
  }

  preview.summary.themes = preview.themeOptions.length;
  preview.summary.colorSchemes = preview.colorSchemeOptions.length;
  preview.summary.semanticColorScales = preview.semanticColorScales.length;
  preview.summary.borderRadii = preview.borderRadii.length;
  preview.summary.warnings = preview.warnings.length;

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
  const selected = Object.keys(selectedTokenSets).map((tokenSet) => {
    const status = selectedTokenSets[tokenSet];
    const file = fileByTokenSet.get(tokenSet);

    return {
      tokenSet,
      status,
      exists: Boolean(file),
      tokenCount: file ? flattenTokens(file.data).length : 0,
    };
  });

  const sourceCount = selected.filter(
    (item) => item.status === 'source',
  ).length;
  if (sourceCount > 1) {
    warnings.push(
      `${theme.name}: har ${sourceCount} token sets markert som source.`,
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
    modes: modes.map((mode) => ({
      name: mode.name,
      tokenSets: mode.selectedTokenSets
        .filter((item) => item.exists)
        .map((item) => item.tokenSet),
    })),
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
      tokenSets: mode.selectedTokenSets
        .filter((item) => item.exists)
        .map((item) => item.tokenSet),
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
    tokenSets: mode.selectedTokenSets
      .filter((item) => item.exists)
      .map((item) => item.tokenSet),
  }));
}

function buildColorSchemeOptions(modePreviews: ModePreview[]): ThemeOption[] {
  return modePreviews
    .filter((mode) => mode.group === COLLECTION.COLOR_SCHEME)
    .map((mode) => ({
      name: mode.name,
      tokenSets: mode.selectedTokenSets
        .filter((item) => item.exists)
        .map((item) => item.tokenSet),
    }));
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
    const roleName = token.path.replace(/\./g, '/');

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
    .sort((a, b) => compareColorScales(a.name, b.name, scaleOrder));
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
      name: token.path.replace(/^border-radius\./, '').replace(/\./g, '/'),
      path: token.path,
      value: token.value,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getSemanticColorScaleOrder(modePreviews: ModePreview[]): string[] {
  const order: string[] = [];

  appendModeNames(order, modePreviews, COLLECTION.COLOR);

  const standardOrder = [
    'neutral',
    'success',
    'warning',
    'danger',
    'error',
    'info',
  ];
  for (const name of standardOrder) {
    if (order.indexOf(name) === -1) {
      order.push(name);
    }
  }

  return order;
}

function appendModeNames(
  order: string[],
  modePreviews: ModePreview[],
  group: string,
): void {
  for (const mode of modePreviews) {
    if (mode.group === group && order.indexOf(mode.name) === -1) {
      order.push(mode.name);
    }
  }
}

function compareColorScales(
  a: string,
  b: string,
  scaleOrder: string[],
): number {
  const indexA = scaleOrder.indexOf(a);
  const indexB = scaleOrder.indexOf(b);
  const safeA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
  const safeB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;

  if (safeA !== safeB) {
    return safeA - safeB;
  }

  return a.localeCompare(b);
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
  const mapping: Record<string, string> = {
    color: 'COLOR',
    dimension: 'FLOAT',
    number: 'FLOAT',
    borderWidth: 'FLOAT',
    opacity: 'FLOAT',
    fontSizes: 'FLOAT',
    lineHeights: 'FLOAT',
    letterSpacing: 'FLOAT',
    fontFamilies: 'STRING',
    fontWeights: 'STRING',
    typography: 'STYLE_TEXT',
    boxShadow: 'STYLE_EFFECT',
  };

  return mapping[type || ''] || type || '(unknown)';
}
