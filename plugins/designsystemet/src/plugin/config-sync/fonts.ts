import { FIGMA_COLLECTION } from '@digdir/designsystemet/internal';
import type { CollectionSpec } from './collection-specs';

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
// half-synced when Figma fails to apply it to a bound text style.
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
    `${missing.length === 1 ? 'Font' : 'Fonts'} not available in Figma: ${missing.join(', ')}. Install or enable the ${missing.length === 1 ? 'font' : 'fonts'}, or change font-family in the config, then sync again.`,
  );
}

// Font families the file uses now, from font-family variables and text styles. Figma applies
// each value the sync writes to the text styles bound to it, together with the values not yet
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

export async function preloadAllFonts(
  fontFamilies: Iterable<string>,
  fontCache: FontCache,
): Promise<void> {
  // Load every available style for each font family we will use.
  // This covers styles already on bound text styles (e.g. "Bold" from a previous
  // sync) that Figma will try to re-apply as soon as the font-family variable
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
