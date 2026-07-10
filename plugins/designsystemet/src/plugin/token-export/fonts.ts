import type { CollectionSpec } from './collection-specs';
import { COLLECTION } from './constants';

export type FontCache = {
  availableFonts: Font[];
  loadedFonts: Set<string>;
};

export async function preloadAllFonts(
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

export async function findFontName(
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
