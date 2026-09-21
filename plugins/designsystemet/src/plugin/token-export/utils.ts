import { COLLECTION } from './constants';
import type { FlatToken } from './types';

export function isMetaFile(path: string): boolean {
  const fileName = path.split('/').pop();
  return Boolean(fileName?.startsWith('$'));
}

// Token paths use dots (color.background.default); Figma variable names use
// slashes (color/background/default).
export function pathToFigmaName(path: string): string {
  return path.replace(/\./g, '/');
}

export function figmaNameToPath(name: string): string {
  return name.replace(/\//g, '.');
}

// Sorts by position in `order`; names not in the list go last, alphabetically.
export function compareByOrder(
  a: string,
  b: string,
  order: readonly string[],
): number {
  const indexA = order.indexOf(a);
  const indexB = order.indexOf(b);
  const safeA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
  const safeB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;

  if (safeA !== safeB) {
    return safeA - safeB;
  }

  return a.localeCompare(b);
}

export function parseNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const number = Number(value.replace(/px|%/g, ''));
  return Number.isFinite(number) ? number : null;
}

export function inferVariableName(
  group: string,
  modeName: string,
  token: FlatToken,
): string {
  const figmaName = token.figmaName;

  if (group === COLLECTION.COLOR_SCHEME && figmaName.startsWith('theme/')) {
    return `${modeName}/${figmaName.replace(/^theme\//, '')}`;
  }

  if (group === COLLECTION.THEME && figmaName.startsWith('theme/')) {
    return figmaName.replace(/^theme\//, '');
  }

  if (group === COLLECTION.TYPOGRAPHY && figmaName.startsWith('theme/')) {
    return `${modeName}/${figmaName.replace(/^theme\//, '')}`;
  }

  if (group === COLLECTION.SIZE) {
    if (token.path.startsWith('size._')) {
      return `_size/${token.path.replace(/^size\._/, '')}`;
    }

    if (token.path.startsWith('_size.')) {
      return `_size/${token.path.replace(/^_size\./, '')}`;
    }
  }

  return figmaName;
}

export function formatValue(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  return JSON.stringify(value);
}
