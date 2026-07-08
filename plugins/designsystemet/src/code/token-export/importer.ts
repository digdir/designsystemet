import { COLLECTION } from './constants';
import { getActiveTokenSets, resolveValue } from './resolver';
import { applyScopesAndSyntax } from './scope-syntax';
import type { FlatToken, PreviewData } from './types';
import { parseNumber } from './utils';

type ImportPayload = {
  preview: PreviewData;
  selectedTheme: string | null;
  selectedScheme: string | null;
};

type ValueSpec =
  | {
      kind: 'raw';
      value: VariableValue;
    }
  | {
      kind: 'alias';
      collection: string;
      name: string;
    };

type VariableSpec = {
  name: string;
  type: VariableResolvedDataType;
  valuesByMode: Map<string, ValueSpec>;
};

type CollectionSpec = {
  name: string;
  modeNames: string[];
  variables: Map<string, VariableSpec>;
};

type FontCache = {
  availableFonts: Font[];
  loadedFonts: Set<string>;
};

export async function importToFigma(
  payload: ImportPayload,
): Promise<{ logs: string[] }> {
  const logs: string[] = [];
  const activeTokenSets = getActiveTokenSets(
    payload.preview,
    payload.selectedTheme,
    payload.selectedScheme,
  );

  const fontCache: FontCache = {
    availableFonts: await figma.listAvailableFontsAsync(),
    loadedFonts: new Set<string>(),
  };

  const collectionSpecs = buildCollectionSpecs(
    payload.preview,
    activeTokenSets,
    logs,
  );

  // Fonts must be loaded before syncVariables runs. If text styles from a previous
  // import are already bound to font-family variables, Figma will immediately try to
  // apply the new font family with whatever style the text style currently has —
  // which may include styles like "Bold" that are not in our token structure.
  // Loading all variants of every font family we will use prevents this.
  await preloadAllFonts(collectionSpecs, fontCache);
  const collectionMap = await syncCollections(collectionSpecs, logs);
  const variableLookup = await syncVariables(
    collectionSpecs,
    collectionMap,
    logs,
  );
  await syncTextStyles(
    payload.preview,
    activeTokenSets,
    variableLookup,
    fontCache,
    logs,
  );
  await syncEffectStyles(payload.preview, activeTokenSets, logs);

  // Auto-apply correct scopes and CSS code syntax so users get them out of the box.
  // Best-effort: the variables are already written, so a failure here must not fail the
  // whole export.
  try {
    await applyScopesAndSyntax(logs);
  } catch (error) {
    logs.push(
      `Scope/syntax pass failed (import still applied): ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  return { logs };
}

function buildCollectionSpecs(
  preview: PreviewData,
  activeTokenSets: string[],
  logs: string[],
): CollectionSpec[] {
  const byGroup = new Map<string, CollectionSpec>();

  for (const mode of preview.themes) {
    if (!byGroup.has(mode.group)) {
      byGroup.set(mode.group, {
        name: mode.group,
        modeNames: [],
        variables: new Map<string, VariableSpec>(),
      });
    }

    const collection = byGroup.get(mode.group)!;
    collection.modeNames.push(mode.name);
    const modeActiveTokenSets = getModeActiveTokenSets(
      preview,
      activeTokenSets,
      mode,
    );

    for (const selected of mode.selectedTokenSets) {
      if (!selected.exists) {
        continue;
      }

      // `primitives/globals` is a `source` set of raw primitives (border-width, opacity,
      // shadows). These must not become their own variables (e.g. an opacity variable
      // literally named "30") — their values are inlined into the semantic tokens that
      // reference them. They still take part in alias resolution via
      // getModeActiveTokenSets, so consumers resolve to the correct literal.
      if (selected.tokenSet === 'primitives/globals') {
        continue;
      }

      const tokens = preview.flatTokens.filter(
        (token) => token.tokenSet === selected.tokenSet,
      );

      for (const token of tokens) {
        const entries = expandVariableEntries(
          preview,
          mode.group,
          mode.name,
          token,
        );

        for (const entry of entries) {
          const variableType = mapVariableType(token.type);
          if (!variableType) {
            continue;
          }

          // Line-height and letter-spacing are written as static values on the text styles
          // (Figma can't bind them per our structure) and are never bound to variables, so
          // we don't emit them as variables. Only font-size is kept from the typography set.
          if (token.type === 'lineHeights' || token.type === 'letterSpacing') {
            continue;
          }

          if (!collection.variables.has(entry.name)) {
            collection.variables.set(entry.name, {
              name: entry.name,
              type: variableType,
              valuesByMode: new Map<string, ValueSpec>(),
            });
          }

          const variable = collection.variables.get(entry.name)!;
          const valueSpec = buildValueSpec(
            token,
            preview,
            modeActiveTokenSets,
            mode.group,
            mode.name,
            entry.name,
          );

          if (!valueSpec) {
            logs.push(
              `Skipped unresolved value for ${mode.group}/${entry.name} (${mode.name})`,
            );
            continue;
          }

          variable.valuesByMode.set(mode.name, valueSpec);
        }
      }
    }
  }

  return Array.from(byGroup.values());
}

function getModeActiveTokenSets(
  preview: PreviewData,
  activeTokenSets: string[],
  mode: PreviewData['themes'][number],
): string[] {
  const prioritized: string[] = [];

  for (const selected of mode.selectedTokenSets) {
    if (selected.exists && prioritized.indexOf(selected.tokenSet) === -1) {
      prioritized.push(selected.tokenSet);
    }
  }

  for (const tokenSet of activeTokenSets) {
    if (prioritized.indexOf(tokenSet) === -1) {
      prioritized.push(tokenSet);
    }
  }

  for (const tokenSet of preview.tokenSets.map((item) => item.path)) {
    if (prioritized.indexOf(tokenSet) === -1) {
      prioritized.push(tokenSet);
    }
  }

  return prioritized;
}

function expandVariableEntries(
  preview: PreviewData,
  group: string,
  modeName: string,
  token: FlatToken,
): Array<{ name: string }> {
  if (group === COLLECTION.COLOR_SCHEME || group === COLLECTION.TYPOGRAPHY) {
    const scopedName = inferScopedThemeVariableName(preview, token);
    if (scopedName) {
      return [{ name: scopedName }];
    }
  }

  return [{ name: inferVariableName(group, modeName, token) }];
}

function inferVariableName(
  group: string,
  modeName: string,
  token: FlatToken,
): string {
  const figmaName = token.figmaName;

  if (group === COLLECTION.COLOR_SCHEME && figmaName.indexOf('theme/') === 0) {
    return `${modeName}/${figmaName.replace(/^theme\//, '')}`;
  }

  if (group === COLLECTION.THEME && figmaName.indexOf('theme/') === 0) {
    return figmaName.replace(/^theme\//, '');
  }

  if (group === COLLECTION.TYPOGRAPHY && figmaName.indexOf('theme/') === 0) {
    return `${modeName}/${figmaName.replace(/^theme\//, '')}`;
  }

  if (group === COLLECTION.SIZE) {
    if (token.path.indexOf('size._') === 0) {
      return `_size/${token.path.replace(/^size\._/, '')}`;
    }

    if (token.path.indexOf('_size.') === 0) {
      return `_size/${token.path.replace(/^_size\./, '')}`;
    }
  }

  return figmaName;
}

function buildValueSpec(
  token: FlatToken,
  preview: PreviewData,
  activeTokenSets: string[],
  group: string,
  modeName: string,
  variableName: string,
): ValueSpec | null {
  const exactReference =
    typeof token.value === 'string' ? token.value.match(/^\{([^}]+)\}$/) : null;

  if (exactReference) {
    const aliasTarget = shouldResolveReferenceAsRaw(token, group)
      ? null
      : mapReferenceToVariableTarget(
          exactReference[1],
          preview,
          token,
          group,
          modeName,
          variableName,
        );

    if (aliasTarget) {
      return {
        kind: 'alias',
        collection: aliasTarget.collection,
        name: aliasTarget.name,
      };
    }
  }

  const resolved = resolveValue(token.value, preview, activeTokenSets, []);
  const rawValue = convertRawVariableValue(token.type, resolved);

  if (rawValue === null) {
    return null;
  }

  return {
    kind: 'raw',
    value: rawValue,
  };
}

function shouldResolveReferenceAsRaw(token: FlatToken, group: string): boolean {
  // Border-radius tokens in Theme are the first definition of the scale — raw values
  // computed from a math formula. They are the source of truth that other collections
  // (e.g. Semantic) alias back to. Keeping them as aliases here would create a circular
  // reference to a primitive that has no corresponding Figma variable.
  return (
    group === COLLECTION.THEME && token.path.indexOf('border-radius.') === 0
  );
}

function mapReferenceToVariableTarget(
  reference: string,
  preview: PreviewData,
  token: FlatToken,
  group: string,
  modeName: string,
  _variableName: string,
): { collection: string; name: string } | null {
  const themeScopedSuffix = getThemeScopedSuffix(reference, preview, token);

  if (group === COLLECTION.THEME && themeScopedSuffix) {
    if (
      themeScopedSuffix === 'font-family' ||
      themeScopedSuffix.indexOf('font-weight/') === 0
    ) {
      return {
        collection: COLLECTION.TYPOGRAPHY,
        name: `${modeName}/${themeScopedSuffix}`,
      };
    }

    return {
      collection: COLLECTION.COLOR_SCHEME,
      name: `${modeName}/${themeScopedSuffix}`,
    };
  }

  if (reference.indexOf('theme.') === 0) {
    const rawSuffix = reference.replace(/^theme\./, '');
    const suffix = rawSuffix.replace(/\./g, '/');

    if (group === COLLECTION.COLOR_SCHEME || group === COLLECTION.TYPOGRAPHY) {
      const themePrefix = preview.themeOptions[0]?.name || 'theme';
      return {
        collection: group,
        name: `${themePrefix}/${suffix}`,
      };
    }

    return {
      collection: COLLECTION.THEME,
      name: suffix,
    };
  }

  if (reference.indexOf('color.') === 0) {
    if (group === COLLECTION.COLOR) {
      return {
        collection: COLLECTION.SEMANTIC,
        name: reference.replace(/\./g, '/'),
      };
    }

    if (group === COLLECTION.SEMANTIC) {
      return {
        collection: COLLECTION.THEME,
        name: reference.replace(/\./g, '/'),
      };
    }
  }

  if (reference.indexOf('border-radius.') === 0) {
    const name = reference.replace(/\./g, '/');
    return {
      collection: group === COLLECTION.SEMANTIC ? COLLECTION.THEME : group,
      name,
    };
  }

  if (reference.indexOf('_size.') === 0 || reference.indexOf('size._') === 0) {
    const name =
      reference.indexOf('_size.') === 0
        ? `_size/${reference.replace(/^_size\./, '')}`
        : `_size/${reference.replace(/^size\._/, '')}`;
    return {
      collection: COLLECTION.SIZE,
      name,
    };
  }

  if (reference.indexOf('font-size.') === 0) {
    return {
      collection: COLLECTION.SIZE,
      name: reference.replace(/\./g, '/'),
    };
  }

  if (
    reference.indexOf('font-family') === 0 ||
    reference.indexOf('font-weight.') === 0 ||
    (group === COLLECTION.THEME && reference.indexOf('border-width.') === 0) ||
    (group === COLLECTION.THEME && reference.indexOf('opacity.') === 0)
  ) {
    return {
      collection: COLLECTION.THEME,
      name: reference.replace(/\./g, '/'),
    };
  }

  // Semantic border-width / opacity tokens (e.g. border-width.default -> {border-width.1},
  // opacity.disabled -> {opacity.30}) reference raw primitives in the source-only
  // primitives/globals set, which we do not emit as variables. Returning null here makes
  // buildValueSpec inline the resolved literal instead of aliasing a non-existent variable.
  return null;
}

function getThemeScopedSuffix(
  reference: string,
  preview: PreviewData,
  token: FlatToken,
): string | null {
  const parts = reference.split('.');
  if (parts.length < 2) {
    return null;
  }

  const knownScopes = new Set<string>([
    'theme',
    getThemeNameFromTokenSet(preview, token.tokenSet),
    ...preview.themeOptions.map((option) => option.name),
  ]);

  if (!knownScopes.has(parts[0])) {
    return null;
  }

  return parts.slice(1).join('/');
}

function mapVariableType(type: string | null): VariableResolvedDataType | null {
  switch (type) {
    case 'color':
      return 'COLOR';
    case 'dimension':
    case 'number':
    case 'borderWidth':
    case 'opacity':
    case 'fontSizes':
    case 'lineHeights':
    case 'letterSpacing':
      return 'FLOAT';
    case 'fontFamilies':
    case 'fontWeights':
    case 'text':
      return 'STRING';
    default:
      return null;
  }
}

function convertRawVariableValue(
  type: string | null,
  value: unknown,
): VariableValue | null {
  switch (type) {
    case 'color':
      return parseColorValue(value);
    case 'dimension':
    case 'number':
    case 'borderWidth':
    case 'opacity':
    case 'fontSizes':
    case 'lineHeights':
    case 'letterSpacing': {
      const number = parseNumber(value);
      return number === null ? null : number;
    }
    case 'fontFamilies':
    case 'fontWeights':
    case 'text':
      return typeof value === 'string' ? value : null;
    default:
      return null;
  }
}

async function syncCollections(
  specs: CollectionSpec[],
  logs: string[],
): Promise<Map<string, VariableCollection>> {
  const existingCollections =
    await figma.variables.getLocalVariableCollectionsAsync();
  const collectionByName = new Map(
    existingCollections.map((item) => [item.name, item]),
  );
  const result = new Map<string, VariableCollection>();

  for (const spec of specs) {
    figma.ui.postMessage({
      type: 'export-tokens-to-figma-result',
      status: 'exporting',
      message: `Creating collection ${spec.name} with modes: ${spec.modeNames.join(', ')}`,
    });
    const collection =
      collectionByName.get(spec.name) ||
      figma.variables.createVariableCollection(spec.name);

    if (!collectionByName.has(spec.name)) {
      logs.push(`Created collection: ${spec.name}`);
    }

    await ensureModes(collection, spec.modeNames, logs);
    result.set(spec.name, collection);
  }

  return result;
}

async function ensureModes(
  collection: VariableCollection,
  desiredModeNames: string[],
  logs: string[],
): Promise<void> {
  if (desiredModeNames.length === 0) {
    return;
  }

  const existing = collection.modes.slice();

  if (existing.length === 1 && existing[0].name !== desiredModeNames[0]) {
    collection.renameMode(existing[0].modeId, desiredModeNames[0]);
    logs.push(
      `Renamed mode ${existing[0].name} -> ${desiredModeNames[0]} in ${collection.name}`,
    );
  }

  for (const modeName of desiredModeNames) {
    if (!collection.modes.some((mode) => mode.name === modeName)) {
      collection.addMode(modeName);
      logs.push(`Created mode ${modeName} in ${collection.name}`);
    }
  }

  for (const mode of collection.modes.slice()) {
    if (!desiredModeNames.includes(mode.name) && collection.modes.length > 1) {
      collection.removeMode(mode.modeId);
      logs.push(`Deleted mode ${mode.name} from ${collection.name}`);
    }
  }
}

async function syncVariables(
  specs: CollectionSpec[],
  collectionMap: Map<string, VariableCollection>,
  logs: string[],
): Promise<Map<string, Variable>> {
  const allVariables = await figma.variables.getLocalVariablesAsync();
  const byCompositeKey = new Map<string, Variable>();
  const variablesByCollection = new Map<string, Map<string, Variable>>();

  for (const spec of specs) {
    const collection = collectionMap.get(spec.name);
    if (!collection) {
      continue;
    }

    const existingInCollection = allVariables.filter(
      (variable) => variable.variableCollectionId === collection.id,
    );
    const variableByName = new Map(
      existingInCollection.map((item) => [item.name, item]),
    );

    for (const variable of existingInCollection) {
      const desired = spec.variables.get(variable.name);
      if (!desired) {
        variable.remove();
        logs.push(`Deleted variable ${collection.name}/${variable.name}`);
      }
    }

    const createdOrExisting = new Map<string, Variable>();

    for (const desired of spec.variables.values()) {
      let variable = variableByName.get(desired.name);

      if (variable && variable.resolvedType !== desired.type) {
        variable.remove();
        logs.push(
          `Deleted variable ${collection.name}/${desired.name} because type changed to ${desired.type}`,
        );
        variable = undefined;
      }

      if (!variable) {
        variable = figma.variables.createVariable(
          desired.name,
          collection,
          desired.type,
        );
        logs.push(`Created variable ${collection.name}/${desired.name}`);
      }

      createdOrExisting.set(desired.name, variable);
      byCompositeKey.set(`${collection.name}::${desired.name}`, variable);
    }

    variablesByCollection.set(spec.name, createdOrExisting);
  }

  // Raw values are set before aliases so that every alias target already exists
  // in Figma when the alias pass runs (Figma requires the target to exist first).
  for (const spec of specs) {
    const collection = collectionMap.get(spec.name);
    const createdOrExisting = variablesByCollection.get(spec.name);
    if (!collection || !createdOrExisting) {
      continue;
    }

    const modeIdByName = new Map(
      collection.modes.map((mode) => [mode.name, mode.modeId]),
    );
    for (const desired of spec.variables.values()) {
      const variable = createdOrExisting.get(desired.name);
      if (!variable) {
        continue;
      }

      for (const [modeName, valueSpec] of desired.valuesByMode.entries()) {
        if (valueSpec.kind !== 'raw') {
          continue;
        }

        const modeId = modeIdByName.get(modeName);
        if (!modeId) {
          continue;
        }

        variable.setValueForMode(modeId, valueSpec.value);
      }
    }
  }

  for (const spec of specs) {
    const collection = collectionMap.get(spec.name);
    const createdOrExisting = variablesByCollection.get(spec.name);
    if (!collection || !createdOrExisting) {
      continue;
    }

    const modeIdByName = new Map(
      collection.modes.map((mode) => [mode.name, mode.modeId]),
    );
    for (const desired of spec.variables.values()) {
      const variable = createdOrExisting.get(desired.name);
      if (!variable) {
        continue;
      }

      for (const [modeName, valueSpec] of desired.valuesByMode.entries()) {
        if (valueSpec.kind !== 'alias') {
          continue;
        }

        const modeId = modeIdByName.get(modeName);
        const targetVariable = byCompositeKey.get(
          `${valueSpec.collection}::${valueSpec.name}`,
        );
        if (!modeId) {
          continue;
        }

        if (!targetVariable) {
          logs.push(
            `Missing alias target ${valueSpec.collection}/${valueSpec.name} for ${collection.name}/${desired.name}`,
          );
          continue;
        }

        variable.setValueForMode(
          modeId,
          figma.variables.createVariableAlias(targetVariable),
        );
      }
    }
  }

  return byCompositeKey;
}

async function preloadAllFonts(
  specs: CollectionSpec[],
  fontCache: FontCache,
): Promise<void> {
  const fontFamilies = new Set<string>();

  for (const spec of specs) {
    if (spec.name !== COLLECTION.THEME && spec.name !== COLLECTION.TYPOGRAPHY) {
      continue;
    }

    for (const variable of spec.variables.values()) {
      if (variable.type !== 'STRING') {
        continue;
      }

      for (const valueSpec of variable.valuesByMode.values()) {
        if (valueSpec.kind !== 'raw' || typeof valueSpec.value !== 'string') {
          continue;
        }

        if (
          variable.name === 'font-family' ||
          variable.name.endsWith('/font-family')
        ) {
          fontFamilies.add(valueSpec.value);
        }
      }
    }
  }

  // Load every available style for each font family we will use.
  // This covers styles already on bound text styles (e.g. "Bold" from a previous
  // import) that Figma will try to re-apply as soon as the font-family variable
  // value is updated.
  for (const family of fontFamilies) {
    const allStyles = fontCache.availableFonts.filter(
      (f) => f.fontName.family === family,
    );
    for (const font of allStyles) {
      await ensureFontLoaded(fontCache, font.fontName);
    }
  }
}

async function syncTextStyles(
  preview: PreviewData,
  activeTokenSets: string[],
  variableLookup: Map<string, Variable>,
  fontCache: FontCache,
  logs: string[],
): Promise<void> {
  const desired = preview.flatTokens.filter(
    (token) =>
      token.tokenSet === 'semantic/style' && token.type === 'typography',
  );

  const existing = await figma.getLocalTextStylesAsync();
  const desiredNames = new Set(
    desired.map((token) => token.path.replace(/\./g, '/')),
  );

  for (const style of existing) {
    if (
      style.name.indexOf('typography/') === 0 &&
      !desiredNames.has(style.name)
    ) {
      style.remove();
      logs.push(`Deleted text style ${style.name}`);
    }
  }

  for (const token of desired) {
    const styleName = token.path.replace(/\./g, '/');
    const styleValue = resolveCompositeValue(
      token.value,
      preview,
      activeTokenSets,
    ) as Record<string, unknown> | null;

    if (!styleValue) {
      logs.push(
        `Skipped text style ${styleName} because it could not be resolved`,
      );
      continue;
    }

    const fontFamily =
      typeof styleValue.fontFamily === 'string'
        ? styleValue.fontFamily
        : 'Inter';
    const fontWeight =
      typeof styleValue.fontWeight === 'string'
        ? styleValue.fontWeight
        : 'Regular';
    const fontName = await findFontName(fontCache, fontFamily, fontWeight);
    if (!fontName) {
      logs.push(
        `Skipped text style ${styleName} because font ${fontFamily} ${fontWeight} is unavailable`,
      );
      continue;
    }

    await ensureFontLoaded(fontCache, fontName);

    const fontSize = parseNumber(styleValue.fontSize) || 16;
    const lineHeight = toLineHeight(styleValue.lineHeight, fontSize);
    const letterSpacing = toLetterSpacing(styleValue.letterSpacing);

    let style = existing.find((item) => item.name === styleName);
    if (!style) {
      style = figma.createTextStyle();
      style.name = styleName;
      logs.push(`Created text style ${styleName}`);
    }

    style.fontName = fontName;
    style.fontSize = fontSize;
    style.lineHeight = lineHeight;
    style.letterSpacing = letterSpacing;
    style.paragraphSpacing = parseNumber(styleValue.paragraphSpacing) || 0;
    style.paragraphIndent = parseNumber(styleValue.paragraphIndent) || 0;
    style.textCase = toTextCase(styleValue.textCase);
    style.textDecoration = toTextDecoration(styleValue.textDecoration);

    style.setBoundVariable(
      'fontFamily',
      findVariable(variableLookup, COLLECTION.THEME, 'font-family'),
    );
    style.setBoundVariable(
      'fontStyle',
      typeof styleValue.fontWeight === 'string'
        ? findVariable(
            variableLookup,
            COLLECTION.THEME,
            `font-weight/${String(styleValue.fontWeight).toLowerCase()}`,
          )
        : null,
    );
    style.setBoundVariable(
      'fontSize',
      typeof token.value === 'object' &&
        token.value &&
        'fontSize' in token.value
        ? findVariable(
            variableLookup,
            COLLECTION.SIZE,
            normalizeFontSizeReference(
              (token.value as Record<string, unknown>).fontSize,
            ),
          )
        : null,
    );
    style.setBoundVariable('lineHeight', null);
    style.setBoundVariable('letterSpacing', null);
  }
}

async function syncEffectStyles(
  preview: PreviewData,
  activeTokenSets: string[],
  logs: string[],
): Promise<void> {
  const desired = preview.flatTokens.filter(
    (token) =>
      token.tokenSet === 'semantic/style' && token.type === 'boxShadow',
  );

  const existing = await figma.getLocalEffectStylesAsync();
  const desiredNames = new Set(
    desired.map((token) => token.path.replace(/\./g, '/')),
  );

  for (const style of existing) {
    if (style.name.indexOf('shadow/') === 0 && !desiredNames.has(style.name)) {
      style.remove();
      logs.push(`Deleted effect style ${style.name}`);
    }
  }

  for (const token of desired) {
    const styleName = token.path.replace(/\./g, '/');
    const resolved = resolveCompositeValue(
      token.value,
      preview,
      activeTokenSets,
    ) as Array<Record<string, unknown>> | null;

    if (!Array.isArray(resolved)) {
      logs.push(
        `Skipped effect style ${styleName} because it could not be resolved`,
      );
      continue;
    }

    let style = existing.find((item) => item.name === styleName);
    if (!style) {
      style = figma.createEffectStyle();
      style.name = styleName;
      logs.push(`Created effect style ${styleName}`);
    }

    style.effects = resolved
      .map((shadow) => toShadowEffect(shadow))
      .filter((effect): effect is Effect => effect !== null);
  }
}

function findVariable(
  variableLookup: Map<string, Variable>,
  collectionName: string,
  variableName: string | null,
): Variable | null {
  if (!variableName) {
    return null;
  }

  return variableLookup.get(`${collectionName}::${variableName}`) || null;
}

function normalizeFontSizeReference(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const match = value.match(/^\{([^}]+)\}$/);
  if (!match) {
    return null;
  }

  return match[1].replace(/\./g, '/');
}

function resolveCompositeValue(
  value: unknown,
  preview: PreviewData,
  activeTokenSets: string[],
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) =>
      resolveCompositeValue(item, preview, activeTokenSets),
    );
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [
        key,
        resolveCompositeValue(nested, preview, activeTokenSets),
      ]),
    );
  }

  return resolveValue(value, preview, activeTokenSets, []);
}

async function findFontName(
  fontCache: FontCache,
  family: string,
  styleName: string,
): Promise<FontName | null> {
  const normalizedStyle = normalizeFontStyle(styleName);
  const exact = fontCache.availableFonts.find(
    (font) =>
      font.fontName.family === family &&
      normalizeFontStyle(font.fontName.style) === normalizedStyle,
  );

  if (exact) {
    return exact.fontName;
  }

  const familyFonts = fontCache.availableFonts.filter(
    (font) => font.fontName.family === family,
  );

  return familyFonts[0]?.fontName || null;
}

async function ensureFontLoaded(
  fontCache: FontCache,
  fontName: FontName,
): Promise<void> {
  const key = `${fontName.family}__${fontName.style}`;
  if (fontCache.loadedFonts.has(key)) {
    return;
  }

  await figma.loadFontAsync(fontName);
  fontCache.loadedFonts.add(key);
}

function normalizeFontStyle(style: string): string {
  return style.toLowerCase().replace(/\s+/g, '');
}

function inferScopedThemeVariableName(
  preview: PreviewData,
  token: FlatToken,
): string | null {
  const parts = token.path.split('.');
  if (parts.length < 2) {
    return null;
  }

  const themeName = getThemeNameFromTokenSet(preview, token.tokenSet);
  const knownThemeNames = new Set(
    preview.themeOptions.map((option) => option.name),
  );
  const first = parts[0];
  const shouldStripPrefix = first === 'theme' || knownThemeNames.has(first);
  const suffix = shouldStripPrefix ? parts.slice(1) : parts;

  if (suffix.length === 0) {
    return null;
  }

  return `${themeName}/${suffix.join('/')}`;
}

function getThemeNameFromTokenSet(
  preview: PreviewData,
  tokenSet: string,
): string {
  const parts = tokenSet.split('/').filter(Boolean);
  const last = parts[parts.length - 1];
  if (last && last !== 'theme') {
    return last;
  }

  if (last === 'theme') {
    const prev = parts[parts.length - 2];
    if (
      prev &&
      prev !== 'light' &&
      prev !== 'dark' &&
      prev !== 'primary' &&
      prev !== 'secondary'
    ) {
      return prev;
    }
  }

  return preview.themeOptions[0]?.name || last || 'theme';
}

function toLineHeight(value: unknown, fontSize: number): LineHeight {
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    if (lower === 'normal' || lower === 'auto') {
      return { unit: 'AUTO' };
    }

    if (lower.indexOf('%') !== -1) {
      const number = parseNumber(lower);
      return { unit: 'PERCENT', value: number === null ? 100 : number };
    }
  }

  const number = parseNumber(value);
  return { unit: 'PIXELS', value: number === null ? fontSize : number };
}

function toLetterSpacing(value: unknown): LetterSpacing {
  if (typeof value === 'string' && value.indexOf('%') !== -1) {
    const number = parseNumber(value);
    return { unit: 'PERCENT', value: number === null ? 0 : number };
  }

  const number = parseNumber(value);
  return { unit: 'PIXELS', value: number === null ? 0 : number };
}

function toTextCase(value: unknown): TextCase {
  if (typeof value !== 'string') {
    return 'ORIGINAL';
  }

  switch (value.toLowerCase()) {
    case 'uppercase':
      return 'UPPER';
    case 'lowercase':
      return 'LOWER';
    case 'capitalize':
      return 'TITLE';
    default:
      return 'ORIGINAL';
  }
}

function toTextDecoration(value: unknown): TextDecoration {
  if (typeof value !== 'string') {
    return 'NONE';
  }

  switch (value.toLowerCase()) {
    case 'underline':
      return 'UNDERLINE';
    case 'line-through':
      return 'STRIKETHROUGH';
    default:
      return 'NONE';
  }
}

function toShadowEffect(shadow: Record<string, unknown>): Effect | null {
  const color = parseColorValue(shadow.color);
  if (!color) {
    return null;
  }

  return {
    type: 'DROP_SHADOW',
    visible: true,
    blendMode: 'NORMAL',
    color,
    offset: {
      x: parseNumber(shadow.x) || 0,
      y: parseNumber(shadow.y) || 0,
    },
    radius: parseNumber(shadow.blur) || 0,
    spread: parseNumber(shadow.spread) || 0,
  };
}

function parseColorValue(value: unknown): RGBA | null {
  if (typeof value !== 'string') {
    return null;
  }

  const rgbaMatch = value.match(
    /^rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*(?:,\s*([0-9.]+)\s*)?\)$/i,
  );
  if (rgbaMatch) {
    return {
      r: Number(rgbaMatch[1]) / 255,
      g: Number(rgbaMatch[2]) / 255,
      b: Number(rgbaMatch[3]) / 255,
      a: rgbaMatch[4] === undefined ? 1 : Number(rgbaMatch[4]),
    };
  }

  let hex = value.trim();
  if (!hex.startsWith('#')) {
    return null;
  }

  hex = hex.slice(1);

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  if (hex.length !== 6 && hex.length !== 8) {
    return null;
  }

  return {
    r: parseInt(hex.slice(0, 2), 16) / 255,
    g: parseInt(hex.slice(2, 4), 16) / 255,
    b: parseInt(hex.slice(4, 6), 16) / 255,
    a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1,
  };
}
