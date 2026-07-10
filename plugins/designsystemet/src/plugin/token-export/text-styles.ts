import { COLLECTION } from './constants';
import { ensureFontLoaded, type FontCache, findFontName } from './fonts';
import { resolveCompositeValue } from './resolver';
import type { PreviewData } from './types';
import { parseNumber } from './utils';
import { findVariable } from './variable-sync';

export async function syncTextStyles(
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
