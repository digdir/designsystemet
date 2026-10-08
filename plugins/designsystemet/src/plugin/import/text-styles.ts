import { FIGMA_COLLECTION } from '@digdir/designsystemet/internal';
import { ensureFontLoaded, type FontCache, findFontName } from './fonts';
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
import { parseNumber, pathToFigmaName } from './utils';
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

    await ensureFontLoaded(fontCache, fontName);

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
      findVariable(variableLookup, FIGMA_COLLECTION.THEME, 'font-family'),
    );
    style.setBoundVariable(
      'fontStyle',
      typeof styleValue.fontWeight === 'string'
        ? findVariable(
            variableLookup,
            FIGMA_COLLECTION.THEME,
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
            FIGMA_COLLECTION.SIZE,
            normalizeFontSizeReference(
              (token.value as Record<string, unknown>).fontSize,
            ),
          )
        : null,
    );
    style.setBoundVariable('lineHeight', null);
    style.setBoundVariable('letterSpacing', null);

    if (before) {
      const changed = changedFields(before, snapshotTextStyle(style));
      if (changed.length > 0) {
        log.info.push(`Updated text style ${styleName}: ${changed.join(', ')}`);
      }
    }
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
