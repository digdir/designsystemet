import { FIGMA_COLLECTION } from '@digdir/designsystemet/internal';
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

/**
 * Whether a value Figma has is already the value the import would write, e.g. a variable's value in a mode or a
 * text style's line height. Only the fields the import writes are compared, as Figma adds some of its own (e.g.
 * alpha on colors, variationSettings on fonts). Numbers only need to be close, as Figma may store them with less
 * precision than they were written with.
 */
export function sameValue(current: unknown, desired: unknown): boolean {
  if (typeof current === 'number' && typeof desired === 'number') {
    return Math.abs(current - desired) < 1e-4;
  }
  if (
    !current ||
    !desired ||
    typeof current !== 'object' ||
    typeof desired !== 'object'
  ) {
    return current === desired;
  }
  const currentRecord = current as Record<string, unknown>;
  return Object.entries(desired).every(([key, value]) =>
    sameValue(currentRecord[key], value),
  );
}
