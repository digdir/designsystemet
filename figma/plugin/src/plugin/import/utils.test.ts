import { describe, expect, it } from 'vitest';
import { sameValue } from './utils';

describe('sameValue', () => {
  it('compares strings and booleans exactly', () => {
    expect(sameValue('Inter', 'Inter')).toBe(true);
    expect(sameValue('Inter', 'Roboto')).toBe(false);
    expect(sameValue(true, true)).toBe(true);
    expect(sameValue(undefined, 'Inter')).toBe(false);
  });

  it('treats numbers within float precision as equal', () => {
    expect(sameValue(0.30000001192092896, 0.3)).toBe(true);
    expect(sameValue(16, 18)).toBe(false);
  });

  it('ignores fields Figma adds that the import does not write', () => {
    expect(
      sameValue(
        { family: 'Inter', style: 'Medium', variationSettings: { wght: 500 } },
        { family: 'Inter', style: 'Medium' },
      ),
    ).toBe(true);
  });

  it('matches an RGB color against the RGBA Figma stores', () => {
    expect(
      sameValue({ r: 0.2, g: 0.4, b: 0.6, a: 1 }, { r: 0.2, g: 0.4, b: 0.6 }),
    ).toBe(true);
    expect(
      sameValue(
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
    expect(sameValue(alias('a'), alias('a'))).toBe(true);
    expect(sameValue(alias('a'), alias('b'))).toBe(false);
    expect(sameValue('Inter', alias('a'))).toBe(false);
  });
});
