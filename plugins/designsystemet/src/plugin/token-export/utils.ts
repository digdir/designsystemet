import { FIGMA_COLLECTION } from '@digdir/designsystemet/tokens/create';
import type { FlatToken } from './types';

// Token paths use dots (color.background.default); Figma variable names use
// slashes (color/background/default).
export function pathToFigmaName(path: string): string {
  return path.replace(/\./g, '/');
}

export function figmaNameToPath(name: string): string {
  return name.replace(/\//g, '.');
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

  if (
    group === FIGMA_COLLECTION.COLOR_SCHEME &&
    figmaName.startsWith('theme/')
  ) {
    return `${modeName}/${figmaName.replace(/^theme\//, '')}`;
  }

  if (group === FIGMA_COLLECTION.THEME && figmaName.startsWith('theme/')) {
    return figmaName.replace(/^theme\//, '');
  }

  if (group === FIGMA_COLLECTION.TYPOGRAPHY && figmaName.startsWith('theme/')) {
    return `${modeName}/${figmaName.replace(/^theme\//, '')}`;
  }

  if (group === FIGMA_COLLECTION.SIZE) {
    if (token.path.startsWith('size._')) {
      return `_size/${token.path.replace(/^size\._/, '')}`;
    }

    if (token.path.startsWith('_size.')) {
      return `_size/${token.path.replace(/^_size\./, '')}`;
    }
  }

  return figmaName;
}
