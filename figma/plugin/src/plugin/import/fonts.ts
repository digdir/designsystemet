import { FIGMA_COLLECTION } from '@digdir/designsystemet/internal';
import type { CollectionSpec, VariableSpec } from './collection-specs';
import { sameValue } from './utils';

export type FontCache = {
  availableFonts: Font[];
  loadedFonts: Set<string>;
};

// The font families the THEME and TYPOGRAPHY collections set as raw font-family values.
export function collectFontFamilies(specs: CollectionSpec[]): Set<string> {
  const fontFamilies = new Set<string>();

  for (const spec of specs) {
    if (
      spec.name !== FIGMA_COLLECTION.THEME &&
      spec.name !== FIGMA_COLLECTION.TYPOGRAPHY
    ) {
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

  return fontFamilies;
}

// Throws before anything is written, so a font that isn't installed doesn't leave the file
// half-imported when Figma fails to apply it to a bound text style.
export function assertFontFamiliesAvailable(
  fontFamilies: Set<string>,
  fontCache: FontCache,
): void {
  const available = new Set(
    fontCache.availableFonts.map((font) => font.fontName.family),
  );
  const missing = [...fontFamilies].filter((family) => !available.has(family));
  if (missing.length === 0) {
    return;
  }

  throw new Error(
    `${missing.length === 1 ? 'Font' : 'Fonts'} not available in Figma: ${missing.join(', ')}. Install or enable the ${missing.length === 1 ? 'font' : 'fonts'}, or change font-family in the config, then import again.`,
  );
}

// Font families the file uses now, from font-family variables and text styles. Figma applies
// each value the import writes to the text styles bound to it, together with the values not yet
// written, so the current fonts have to be loaded as well as the new ones.
export async function collectFontFamiliesInFile(): Promise<Set<string>> {
  const families = new Set<string>();

  for (const variable of await figma.variables.getLocalVariablesAsync(
    'STRING',
  )) {
    if (!/(^|\/)font-family$/.test(variable.name)) {
      continue;
    }
    for (const value of Object.values(variable.valuesByMode)) {
      if (typeof value === 'string') {
        families.add(value);
      }
    }
  }

  for (const style of await figma.getLocalTextStylesAsync()) {
    families.add(style.fontName.family);
  }

  return families;
}

// Whether the import will write a new value to a variable that text styles take their font from. Figma applies
// such a value to the text styles bound to it straight away, which needs their fonts loaded (see preloadAllFonts),
// and loading them can take seconds. Errs towards true when it can't tell.
export async function willChangeFontVariables(
  specs: CollectionSpec[],
): Promise<boolean> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const variables = await figma.variables.getLocalVariablesAsync();
  const collectionByName = new Map(
    collections.map((item) => [item.name, item]),
  );
  const collectionNameById = new Map(
    collections.map((item) => [item.id, item.name]),
  );
  const variableByKey = new Map(
    variables.map((variable) => [
      `${collectionNameById.get(variable.variableCollectionId)}::${variable.name}`,
      variable,
    ]),
  );
  const variableById = new Map(
    variables.map((variable) => [variable.id, variable]),
  );
  const specByKey = new Map<
    string,
    { spec: CollectionSpec; variable: VariableSpec }
  >();
  for (const spec of specs) {
    for (const variable of spec.variables.values()) {
      specByKey.set(`${spec.name}::${variable.name}`, { spec, variable });
    }
  }

  // The font variables, and the variables they alias to, as the text styles get their values through them.
  const pending = [...specByKey.keys()].filter((key) =>
    /(^|\/)font-(family|weight|size)(\/|$)/.test(key.split('::')[1]),
  );
  const checked = new Set<string>();
  for (let key = pending.pop(); key !== undefined; key = pending.pop()) {
    if (checked.has(key)) {
      continue;
    }
    checked.add(key);
    const desired = specByKey.get(key);
    if (!desired) {
      continue;
    }
    const { spec, variable: variableSpec } = desired;

    const collection = collectionByName.get(spec.name);
    const variable = variableByKey.get(key);
    // No text style can be bound to a variable that doesn't exist yet.
    if (!collection || !variable) {
      continue;
    }
    // Adding, removing or reordering modes can change which value the text styles get.
    if (
      collection.modes.map((mode) => mode.name).join('\n') !==
      spec.modeNames.join('\n')
    ) {
      return true;
    }
    if (variable.resolvedType !== variableSpec.type) {
      return true;
    }

    for (const mode of collection.modes) {
      const valueSpec = variableSpec.valuesByMode.get(mode.name);
      if (!valueSpec) {
        continue;
      }
      const current = variable.valuesByMode[mode.modeId];
      if (valueSpec.kind === 'alias') {
        pending.push(`${valueSpec.collection}::${valueSpec.name}`);
        const target =
          typeof current === 'object' &&
          current &&
          'type' in current &&
          current.type === 'VARIABLE_ALIAS'
            ? variableById.get(current.id)
            : undefined;
        if (
          !target ||
          target.name !== valueSpec.name ||
          collectionNameById.get(target.variableCollectionId) !==
            valueSpec.collection
        ) {
          return true;
        }
      } else if (!sameValue(current, valueSpec.value)) {
        return true;
      }
    }
  }

  return false;
}

export async function preloadAllFonts(
  fontFamilies: Iterable<string>,
  fontCache: FontCache,
): Promise<void> {
  // Load every available style for each font family we will use.
  // This covers styles already on bound text styles (e.g. "Bold" from a previous
  // import) that Figma will try to re-apply as soon as the font-family variable
  // value is updated.
  for (const family of new Set(fontFamilies)) {
    const allStyles = fontCache.availableFonts.filter(
      (f) => f.fontName.family === family,
    );
    for (const font of allStyles) {
      await ensureFontLoaded(fontCache, font.fontName);
    }
  }
}

export function findFontName(
  fontCache: FontCache,
  family: string,
  styleName: string,
): FontName | null {
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

export async function ensureFontLoaded(
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
