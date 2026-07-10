import { parseColorValue } from './color';
import { parseNumber } from './utils';

export function mapVariableType(
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
  switch (type) {
    case 'color':
      return parseColorValue(value);
    case 'dimension':
    case 'number':
    case 'borderWidth':
    case 'opacity':
    case 'fontSizes':
    case 'lineHeights':
    case 'letterSpacing': {
      const number = parseNumber(value);
      return number === null ? null : number;
    }
    case 'fontFamilies':
    case 'fontWeights':
    case 'text':
      return typeof value === 'string' ? value : null;
    default:
      return null;
  }
}
