import { describe, expect, it } from 'vitest';
import { parseView } from './use-view';

describe('parseView', () => {
  it('reads the view names', () => {
    expect(parseView('colorsystem')).toBe('colorsystem');
    expect(parseView('examples')).toBe('examples');
  });

  it('reads the old name of the examples view', () => {
    expect(parseView('overview')).toBe('examples');
  });

  it('falls back to the colour system', () => {
    expect(parseView(null)).toBe('colorsystem');
    expect(parseView('')).toBe('colorsystem');
    expect(parseView('unknown')).toBe('colorsystem');
  });
});
