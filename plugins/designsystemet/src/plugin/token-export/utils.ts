import { COLLECTION } from './constants';
import type { FlatToken } from './types';

export function isMetaFile(path: string): boolean {
  const fileName = path.split('/').pop();
  return Boolean(fileName && fileName.charAt(0) === '$');
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

export function formatValue(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  return JSON.stringify(value);
}

export function toCssColor(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value)) {
    return value;
  }

  if (/^rgba?\(/i.test(value)) {
    return value;
  }

  return null;
}
