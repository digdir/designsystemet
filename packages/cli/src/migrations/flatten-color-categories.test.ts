import { describe, expect, it } from 'vitest';
import { parseJsonc } from '../schemas/helpers.ts';
import migration, { isOldColorSchema } from './flatten-color-categories.ts';

const oldColors = { main: { accent: '#0062BA' }, support: { brand1: '#F45F63' }, neutral: '#1E2B3C' };
const flatColors = { main: '#0062BA', support: '#F45F63', neutral: '#1E2B3C' };

describe('flatten color categories migration', () => {
  it('applies to themes with the old color categories', () => {
    expect(isOldColorSchema({ colors: oldColors })).toBe(true);
    expect(isOldColorSchema({ colors: { accent: '#0062BA', neutral: '#1E2B3C' } })).toBe(false);
    expect(isOldColorSchema({})).toBe(false);
  });

  it('does not apply to three colors that are named like the old categories', () => {
    const config = JSON.stringify({ themes: { one: { colors: flatColors } } });

    expect(isOldColorSchema({ colors: flatColors })).toBe(false);
    expect(migration.check(config)).toBe(false);
  });

  it('moves the colors into one list, with neutral last', () => {
    const config = JSON.stringify({ themes: { old: { colors: oldColors }, flat: { colors: flatColors } } });
    const migrated = parseJsonc<{ themes: Record<string, { colors: Record<string, string> }> }>(migration.no(config));

    expect(Object.entries(migrated.themes.old.colors)).toEqual([
      ['accent', '#0062BA'],
      ['brand1', '#F45F63'],
      ['neutral', '#1E2B3C'],
    ]);
    expect(migrated.themes.flat.colors).toEqual(flatColors);
  });
});
