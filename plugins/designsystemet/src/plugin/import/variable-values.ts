import { figmaVariableType } from '@digdir/designsystemet/internal';
import { parseColorValue } from './color';
import { parseNumber } from './utils';

// Single source of truth for which token types become Figma variables and as
// which resolved type. Types that only exist as styles (typography, boxShadow)
// map to null.
export function mapTokenTypeToVariableType(
  type: string | null,
): VariableResolvedDataType | null {
  return figmaVariableType(type);
}

export function convertRawVariableValue(
  type: string | null,
  value: unknown,
): VariableValue | null {
  switch (mapTokenTypeToVariableType(type)) {
    case 'COLOR':
      return parseColorValue(value);
    case 'FLOAT':
      return parseNumber(value);
    case 'STRING':
      return typeof value === 'string' ? value : null;
    default:
      return null;
  }
}

/**
 * Whether a variable's current value in a mode is already the value the import would write. Colors and aliases
 * are compared by the fields the import writes, so e.g. an RGB color matches the RGBA Figma stores with alpha 1.
 * Numbers only need to be close, as Figma may store them with less precision than they were written with.
 */
export function sameVariableValue(
  current: VariableValue | undefined,
  desired: VariableValue,
): boolean {
  if (typeof current === 'number' && typeof desired === 'number') {
    return Math.abs(current - desired) < 1e-4;
  }
  if (
    typeof current !== 'object' ||
    current === null ||
    typeof desired !== 'object' ||
    desired === null
  ) {
    return current === desired;
  }
  const currentRecord = current as unknown as Record<string, VariableValue>;
  return Object.entries(desired).every(([key, value]) =>
    sameVariableValue(currentRecord[key], value as VariableValue),
  );
}
