import { FIGMA_COLLECTION } from '@digdir/designsystemet/internal';
import {
  ensureFontLoaded,
  type FontCache,
  findFontName,
  preloadAllFonts,
} from './fonts';
import { changedFields, type ImportLog } from './log';
import {
  isManaged,
  keptWarning,
  markManaged,
  splitLeftovers,
} from './ownership';
import type { Pause } from './pause';
import { resolveCompositeValue } from './resolver';
import type { TokenModel } from './types';
import { parseNumber, pathToFigmaName, sameValue } from './utils';
import { findVariable } from './variable-sync';

// Figma text styles are not mode-aware, so theme-dependent values (the font family)
// are written for the first theme; see getTokenSetLookupOrder.
export async function syncTextStyles(
  model: TokenModel,
  tokenSetOrder: string[],
  variableLookup: Map<string, Variable>,
  fontCache: FontCache,
  log: ImportLog,
  pause: Pause,
): Promise<void> {
  const desired = model.flatTokens.filter(
    (token) =>
      token.tokenSet === 'semantic/style' && token.type === 'typography',
  );

  const existing = await figma.getLocalTextStylesAsync();
  const desiredNames = new Set(desired.map((token) => token.figmaName));

  // Only styles the import created, under the name it gave them, are deleted; see ownership.ts. One renamed or
  // duplicated by hand counts as the user's and is kept. The import's own styles count wherever they are (e.g. if
  // the names it gives change); other styles only count under typography/, where they're kept and reported.
  const leftovers = splitLeftovers(
    existing.filter(
      (style) => style.name.startsWith('typography/') || isManaged(style),
    ),
    desiredNames,
    { name: (style) => style.name, managed: isManaged },
  );
  for (const style of leftovers.remove) {
    style.remove();
    log.info.push(`Deleted text style ${style.name}`);
  }
  if (leftovers.keep.length > 0) {
    log.warnings.push(
      keptWarning(
        { one: 'text style', many: 'text styles' },
        leftovers.keep.map((style) => style.name),
      ),
    );
  }

  for (const [index, token] of desired.entries()) {
    await pause(
      () => `Importing text styles (${index + 1} of ${desired.length})`,
    );
    const styleName = token.figmaName;
    const styleValue = resolveCompositeValue(
      token.value,
      model,
      tokenSetOrder,
    ) as Record<string, unknown> | null;

    if (!styleValue) {
      log.warnings.push(
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
    const fontName = findFontName(fontCache, fontFamily, fontWeight);
    if (!fontName) {
      log.warnings.push(
        `Skipped text style ${styleName} because font ${fontFamily} ${fontWeight} is unavailable`,
      );
      continue;
    }

    const fontSize = parseNumber(styleValue.fontSize) || 16;
    const lineHeight = toLineHeight(styleValue.lineHeight, fontSize);
    const letterSpacing = toLetterSpacing(styleValue.letterSpacing);

    let style = existing.find((item) => item.name === styleName);
    const before = style && snapshotTextStyle(style);
    if (!style) {
      style = figma.createTextStyle();
      style.name = styleName;
      log.info.push(`Created text style ${styleName}`);
    }
    // An existing style with a name from the config becomes the import's too, as it's updated from the config.
    markManaged(style);

    // Figma needs a text style's current font, and the one it gets, loaded before anything on it is written.
    // Loading can take seconds, so it's only done once something on the style changes. A style that changes
    // font family goes through the new family with the current font style when the variables are bound, so
    // every style of both families is loaded then, as preloadAllFonts does.
    let fontsLoaded = false;
    const beforeWrite = async (): Promise<void> => {
      if (fontsLoaded) {
        return;
      }
      fontsLoaded = true;
      const current = style.fontName;
      if (current.family !== fontName.family) {
        await preloadAllFonts([current.family, fontName.family], fontCache);
        return;
      }
      if (
        fontCache.availableFonts.some(
          (font) =>
            font.fontName.family === current.family &&
            font.fontName.style === current.style,
        )
      ) {
        await ensureFontLoaded(fontCache, {
          family: current.family,
          style: current.style,
        });
      }
      await ensureFontLoaded(fontCache, fontName);
    };

    const fontFamilyVariable = findVariable(
      variableLookup,
      FIGMA_COLLECTION.THEME,
      'font-family',
    );
    const fontStyleVariable =
      typeof styleValue.fontWeight === 'string'
        ? findVariable(
            variableLookup,
            FIGMA_COLLECTION.THEME,
            `font-weight/${String(styleValue.fontWeight).toLowerCase()}`,
          )
        : null;
    const fontSizeVariable =
      typeof token.value === 'object' &&
      token.value &&
      'fontSize' in token.value
        ? findVariable(
            variableLookup,
            FIGMA_COLLECTION.SIZE,
            normalizeFontSizeReference(
              (token.value as Record<string, unknown>).fontSize,
            ),
          )
        : null;

    // A value bound to a variable comes from the variable, so the raw value is only written when there's
    // no variable. Writing it anyway unbinds the variable, which is then bound again, on every import.
    if (!fontFamilyVariable || !fontStyleVariable) {
      await writeIfChanged(style, 'fontName', fontName, beforeWrite);
    }
    if (!fontSizeVariable) {
      await writeIfChanged(style, 'fontSize', fontSize, beforeWrite);
    }
    await writeIfChanged(style, 'lineHeight', lineHeight, beforeWrite);
    await writeIfChanged(style, 'letterSpacing', letterSpacing, beforeWrite);
    await writeIfChanged(
      style,
      'paragraphSpacing',
      parseNumber(styleValue.paragraphSpacing) || 0,
      beforeWrite,
    );
    await writeIfChanged(
      style,
      'paragraphIndent',
      parseNumber(styleValue.paragraphIndent) || 0,
      beforeWrite,
    );
    await writeIfChanged(
      style,
      'textCase',
      toTextCase(styleValue.textCase),
      beforeWrite,
    );
    await writeIfChanged(
      style,
      'textDecoration',
      toTextDecoration(styleValue.textDecoration),
      beforeWrite,
    );

    await bindIfChanged(style, 'fontFamily', fontFamilyVariable, beforeWrite);
    await bindIfChanged(style, 'fontStyle', fontStyleVariable, beforeWrite);
    await bindIfChanged(style, 'fontSize', fontSizeVariable, beforeWrite);
    await bindIfChanged(style, 'lineHeight', null, beforeWrite);
    await bindIfChanged(style, 'letterSpacing', null, beforeWrite);

    if (before) {
      const changed = changedFields(before, snapshotTextStyle(style));
      if (changed.length > 0) {
        log.info.push(`Updated text style ${styleName}: ${changed.join(', ')}`);
      }
    }
  }
}

// Figma does work for every write to a text style, even when the value is the same as before,
// which made re-importing an unchanged config take tens of seconds. So only what differs is written.
type TextStyleField =
  | 'fontName'
  | 'fontSize'
  | 'lineHeight'
  | 'letterSpacing'
  | 'paragraphSpacing'
  | 'paragraphIndent'
  | 'textCase'
  | 'textDecoration';

async function writeIfChanged<K extends TextStyleField>(
  style: TextStyle,
  field: K,
  value: TextStyle[K],
  beforeWrite: () => Promise<void>,
): Promise<void> {
  if (!sameValue(style[field], value)) {
    await beforeWrite();
    style[field] = value;
  }
}

async function bindIfChanged(
  style: TextStyle,
  field: VariableBindableTextField,
  variable: Variable | null,
  beforeWrite: () => Promise<void>,
): Promise<void> {
  if ((style.boundVariables?.[field]?.id ?? null) !== (variable?.id ?? null)) {
    await beforeWrite();
    style.setBoundVariable(field, variable);
  }
}

// The parts of a text style the import writes, keyed by how they are named in the log.
function snapshotTextStyle(style: TextStyle): Record<string, unknown> {
  return {
    font: style.fontName,
    'font size': style.fontSize,
    'line height': style.lineHeight,
    'letter spacing': style.letterSpacing,
    'paragraph spacing': style.paragraphSpacing,
    'paragraph indent': style.paragraphIndent,
    'text case': style.textCase,
    'text decoration': style.textDecoration,
    'font family variable': style.boundVariables?.fontFamily?.id ?? null,
    'font weight variable': style.boundVariables?.fontStyle?.id ?? null,
    'font size variable': style.boundVariables?.fontSize?.id ?? null,
    'line height variable': style.boundVariables?.lineHeight?.id ?? null,
    'letter spacing variable': style.boundVariables?.letterSpacing?.id ?? null,
  };
}

function normalizeFontSizeReference(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const match = value.match(/^\{([^}]+)\}$/);
  if (!match) {
    return null;
  }

  return pathToFigmaName(match[1]);
}

function toLineHeight(value: unknown, fontSize: number): LineHeight {
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    if (lower === 'normal' || lower === 'auto') {
      return { unit: 'AUTO' };
    }

    if (lower.includes('%')) {
      const number = parseNumber(lower);
      return { unit: 'PERCENT', value: number === null ? 100 : number };
    }
  }

  const number = parseNumber(value);
  return { unit: 'PIXELS', value: number === null ? fontSize : number };
}

function toLetterSpacing(value: unknown): LetterSpacing {
  if (typeof value === 'string' && value.includes('%')) {
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
