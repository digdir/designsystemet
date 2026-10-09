import { describe, expect, it } from 'vitest';
import { sameVariableValue } from './variable-values';

describe('sameVariableValue', () => {
  it('compares strings and booleans exactly', () => {
    expect(sameVariableValue('Inter', 'Inter')).toBe(true);
    expect(sameVariableValue('Inter', 'Roboto')).toBe(false);
    expect(sameVariableValue(true, true)).toBe(true);
    expect(sameVariableValue(undefined, 'Inter')).toBe(false);
  });

  it('treats numbers within float precision as equal', () => {
    expect(sameVariableValue(0.30000001192092896, 0.3)).toBe(true);
    expect(sameVariableValue(16, 18)).toBe(false);
  });

  it('matches an RGB color against the RGBA Figma stores', () => {
    expect(
      sameVariableValue(
        { r: 0.2, g: 0.4, b: 0.6, a: 1 },
        { r: 0.2, g: 0.4, b: 0.6 },
      ),
    ).toBe(true);
    expect(
      sameVariableValue(
        { r: 0.2, g: 0.4, b: 0.6, a: 0.5 },
        { r: 0.2, g: 0.4, b: 0.6, a: 1 },
      ),
    ).toBe(false);
  });

  it('compares aliases by target', () => {
    const alias = (id: string): VariableAlias => ({
      type: 'VARIABLE_ALIAS',
      id,
    });
    expect(sameVariableValue(alias('a'), alias('a'))).toBe(true);
    expect(sameVariableValue(alias('a'), alias('b'))).toBe(false);
    expect(sameVariableValue('Inter', alias('a'))).toBe(false);
  });
});
