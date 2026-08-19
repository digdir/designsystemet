import { semanticColorMap } from '@digdir/designsystemet/color';
import { toCssColor } from './color';
import { COLLECTION } from './constants';
import { findReferences, flattenTokens } from './parser';
import {
  findUnresolvedReferences,
  getActiveTokenSets,
  resolveValue,
} from './resolver';
import type {
  BorderRadiusPreview,
  CollectionPreview,
  FlatToken,
  FontFamilyPreview,
  LoadedFile,
  ModePreview,
  PreviewData,
  SemanticColorScale,
  ThemeOption,
  TokenModel,
} from './types';
import {
  compareByOrder,
  formatValue,
  inferVariableName,
  isMetaFile,
  parseNumber,
  pathToFigmaName,
  previewVariantKey,
} from './utils';
import { mapTokenTypeToVariableType } from './variable-values';

const SEMANTIC_ROLE_ORDER = Object.keys(semanticColorMap);

// Builds the import-side model used by the Figma importer and the resolver.
// This stays on the plugin side; the UI gets buildPreviewData(model) instead.
export function buildTokenModel(files: LoadedFile[]): TokenModel {
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
  for (const set of tokenSets) {
    for (const token of set.tokens) {
      flatTokens.push({
        tokenSet: set.path,
        path: token.path,
        figmaName: pathToFigmaName(token.path),
        type: token.type,
        value: token.value,
        references: findReferences(token.value),
      });
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

  const model: TokenModel = {
    tokenSets: tokenSets.map((set) => ({ path: set.path })),
    flatTokens,
    themes: modePreviews,
    collections,
    themeOptions: buildThemeOptions(
      modePreviews,
      tokenSets.map((set) => set.path),
    ),
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

// One theme/scheme combination the preview values are prepared for.
type PreviewVariant = {
  key: string;
  activeTokenSets: string[];
};

// Builds the UI preview from the token model. Every displayed value is
// resolved here — once per theme/scheme variant — so the UI needs no token
// lookup or resolver, mirroring how the CLI prepares preview tokens
// (packages/cli/src/scripts/update-preview-tokens.ts).
export function buildPreviewData(model: TokenModel): PreviewData {
  const themeNames = optionNamesOrNull(model.themeOptions);
  const schemeNames = optionNamesOrNull(model.colorSchemeOptions);

  const variants: PreviewVariant[] = themeNames.flatMap((theme) =>
    schemeNames.map((scheme) => ({
      key: previewVariantKey(theme, scheme),
      activeTokenSets: getActiveTokenSets(model, theme, scheme),
    })),
  );

  return {
    themeOptions: model.themeOptions.map((option) => option.name),
    colorSchemeOptions: model.colorSchemeOptions.map((option) => option.name),
    semanticColorScales: buildSemanticColorScales(model, variants),
    borderRadii: buildBorderRadii(model, variants),
    fontFamilies: buildFontFamilies(model, variants),
    warnings: model.warnings,
  };
}

// A missing option axis still needs one variant, resolved without that axis.
function optionNamesOrNull(options: ThemeOption[]): Array<string | null> {
  return options.length > 0 ? options.map((option) => option.name) : [null];
}

function prepareValues<T>(
  model: TokenModel,
  variants: PreviewVariant[],
  value: unknown,
  prepare: (resolved: unknown) => T,
): Record<string, T> {
  const values: Record<string, T> = {};
  for (const variant of variants) {
    values[variant.key] = prepare(
      resolveValue(value, model, variant.activeTokenSets, []),
    );
  }
  return values;
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
    .filter((mode) => mode.group === COLLECTION.COLOR_SCHEME)
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

function buildSemanticColorScales(
  model: TokenModel,
  variants: PreviewVariant[],
): SemanticColorScale[] {
  const scales = new Map<string, Array<{ name: string; value: unknown }>>();
  const scaleOrder = getSemanticColorScaleOrder(model.themes);

  for (const token of model.flatTokens) {
    // Each color scale is its own token set (semantic/color/<name>); the token
    // path inside the set is the semantic role (e.g. "background-default").
    const colorSetMatch = /^semantic\/color\/(.+)$/.exec(token.tokenSet);
    if (!colorSetMatch || token.type !== 'color') {
      continue;
    }

    const scaleName = colorSetMatch[1];
    const roles = scales.get(scaleName) || [];
    roles.push({ name: token.figmaName, value: token.value });
    scales.set(scaleName, roles);
  }

  return Array.from(scales.entries())
    .filter(([name]) => name !== 'focus')
    .map(([name, roles]) => ({
      name,
      roles: roles
        .sort((a, b) => compareByOrder(a.name, b.name, SEMANTIC_ROLE_ORDER))
        .map((role) => ({
          name: role.name,
          color: prepareValues(model, variants, role.value, toCssColor),
        })),
    }))
    .sort((a, b) => compareByOrder(a.name, b.name, scaleOrder));
}

function buildBorderRadii(
  model: TokenModel,
  variants: PreviewVariant[],
): BorderRadiusPreview[] {
  return model.flatTokens
    .filter(
      (token) =>
        token.tokenSet === 'semantic/style' &&
        token.type === 'dimension' &&
        token.path.startsWith('border-radius.'),
    )
    .map((token) => ({
      name: pathToFigmaName(token.path.replace(/^border-radius\./, '')),
      values: prepareValues(model, variants, token.value, (resolved) => {
        const number = parseNumber(resolved);
        return {
          px: number === null ? null : Math.max(0, number),
          label: number === null ? formatValue(token.value) : `${number}px`,
        };
      }),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// The font-family token is defined once per `themes/<name>` set, so the same path shows
// up in every theme. Dedupe on path and resolve a `{reference}` instead of any one
// theme's raw value — resolving per variant picks the selected theme's definition.
function buildFontFamilies(
  model: TokenModel,
  variants: PreviewVariant[],
): FontFamilyPreview[] {
  const byPath = new Map<string, { name: string; value: string }>();

  for (const token of model.flatTokens) {
    if (
      token.type !== 'fontFamilies' ||
      (token.path !== 'font-family' && !token.path.startsWith('font-family.'))
    ) {
      continue;
    }

    if (!byPath.has(token.path)) {
      byPath.set(token.path, {
        name: token.figmaName,
        value: `{${token.path}}`,
      });
    }
  }

  return Array.from(byPath.values())
    .map((font) => ({
      name: font.name,
      values: prepareValues(model, variants, font.value, (resolved) => {
        const family =
          typeof resolved === 'string' && resolved.trim() !== ''
            ? resolved
            : null;
        return { family, label: family ?? formatValue(font.value) };
      }),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
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
