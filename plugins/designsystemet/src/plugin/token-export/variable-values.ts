import { parseColorValue } from './color';
import { parseNumber } from './utils';

// Single source of truth for which token types become Figma variables and as
// which resolved type. Types that only exist as styles (typography, boxShadow)
// map to null.
export function mapTokenTypeToVariableType(
  type: string | null,
): VariableResolvedDataType | null {
  switch (type) {
    case 'color':
      return 'COLOR';
    case 'dimension':
    case 'number':
    case 'borderWidth':
    case 'opacity':
    case 'fontSizes':
    case 'lineHeights':
    case 'letterSpacing':
      return 'FLOAT';
    case 'fontFamilies':
    case 'fontWeights':
    case 'text':
      return 'STRING';
    default:
      return null;
  }
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
