import { describe, expect, it } from 'vitest';

import { getAttributes } from './css-attributes';

describe('getAttributes', () => {
  it('returns public data attributes', () => {
    const attributes = getAttributes(`
      .ds-chip[data-variant='primary'] {}
      .ds-chip[data-removable] {}
    `);

    expect(attributes).toEqual({
      removable: '',
      variant: "'primary'",
    });
  });

  it('filters internal floating UI selectors', () => {
    const attributes = getAttributes(`
      .ds-popover[data-floating] {}
      .ds-tooltip[data-floating|='top'] {}
      .ds-combobox [data-floating-ui-portal] {}
      .ds-chip[data-removable] {}
    `);

    expect(attributes).toEqual({ removable: '' });
  });

  it('continues to filter global attributes', () => {
    const attributes = getAttributes(`
      [data-color='neutral'] {}
      [data-size='sm'] {}
      [data-color-scheme='dark'] {}
      [data-removable] {}
    `);

    expect(attributes).toEqual({ removable: '' });
  });

  it('returns an empty object when no data attributes match', () => {
    expect(getAttributes('.ds-button:hover {}')).toEqual({});
  });
});
