import { describe, expect, it } from 'vitest';
import type { PaintContext } from '../rebind';
import { MUTED_COLOR_COMPONENTS, mutedColorRule } from './muted-colors';

const neutral = (step: string) => ({
  collection: 'Semantic',
  name: `color/neutral/${step}`,
});
const color = (name: string) => ({ collection: 'Color', name });

const paint = (overrides: Partial<PaintContext>): PaintContext => ({
  component: 'Dialog',
  variant: '',
  path: '',
  property: 'fill',
  variable: neutral('surface-default'),
  ...overrides,
});

describe('mutedColorRule', () => {
  it('uses the same step of the component’s color for most neutral variables', () => {
    expect(mutedColorRule(paint({}))).toEqual(color('surface-default'));
    expect(
      mutedColorRule(
        paint({
          component: 'Tooltip',
          variable: neutral('background-default'),
        }),
      ),
    ).toEqual(color('background-default'));
  });

  it('makes neutral borders muted', () => {
    expect(
      mutedColorRule(
        paint({ property: 'stroke', variable: neutral('border-subtle') }),
      ),
    ).toEqual(color('border-muted'));
    expect(
      mutedColorRule(
        paint({
          component: 'Textfield',
          path: '/field/field-container',
          property: 'stroke',
          variable: neutral('border-default'),
        }),
      ),
    ).toEqual(color('border-muted'));
  });

  it('keeps the border step for Textarea’s resize handle', () => {
    expect(
      mutedColorRule(
        paint({
          component: 'Textarea',
          path: '/field/Utvid feltet i høyden/Line 1',
          property: 'stroke',
          variable: neutral('border-default'),
        }),
      ),
    ).toEqual(color('border-default'));
  });

  it('makes tinted surfaces muted', () => {
    expect(
      mutedColorRule(
        paint({ component: 'Skeleton', variable: neutral('surface-tinted') }),
      ),
    ).toEqual(color('surface-muted'));
  });

  it('mutes the text in read-only fields, but not their labels', () => {
    const readOnly = {
      component: 'Textfield',
      variant: 'state=read-only, prefix=no, suffix=no',
      property: 'text' as const,
    };
    expect(
      mutedColorRule(
        paint({
          ...readOnly,
          path: '/field/field-container/text/Input text',
          variable: neutral('text-default'),
        }),
      ),
    ).toEqual(color('text-muted'));
    expect(
      mutedColorRule(
        paint({
          ...readOnly,
          path: '/label and description/container/label',
          variable: neutral('text-default'),
        }),
      ),
    ).toEqual(color('text-default'));
  });

  it('uses the text color for field descriptions, also in read-only fields', () => {
    expect(
      mutedColorRule(
        paint({
          component: 'Select',
          variant: 'state=readonly',
          path: '/label and description/description',
          property: 'text',
          variable: neutral('text-subtle'),
        }),
      ),
    ).toEqual(color('text-default'));
  });

  it('mutes affixes and tabs', () => {
    expect(
      mutedColorRule(
        paint({
          component: 'Textfield',
          path: '/field/prefix/text',
          property: 'text',
          variable: neutral('text-subtle'),
        }),
      ),
    ).toEqual(color('text-muted'));
    expect(
      mutedColorRule(
        paint({
          component: 'Tabs',
          path: '/Tabs/1. tab/Text container/Tab',
          property: 'text',
          variable: neutral('text-subtle'),
        }),
      ),
    ).toEqual(color('text-muted'));
  });

  it('uses the text color for option descriptions in Suggestion', () => {
    for (const component of ['.Item in suggestion', '.Item in multiselect']) {
      expect(
        mutedColorRule(
          paint({
            component,
            path: '/Checkbox and label/label and description/description',
            property: 'text',
            variable: neutral('text-subtle'),
          }),
        ),
      ).toEqual(color('text-default'));
    }
  });

  it('keeps subtle text subtle elsewhere', () => {
    expect(
      mutedColorRule(
        paint({
          component: '.Item in suggestion',
          path: '/Checkbox and label/label and description/label',
          property: 'text',
          variable: neutral('text-subtle'),
        }),
      ),
    ).toEqual(color('text-subtle'));
  });

  it('makes Error summary text danger', () => {
    expect(
      mutedColorRule(
        paint({
          component: 'Error summary',
          property: 'text',
          variable: neutral('text-default'),
        }),
      ),
    ).toEqual({ collection: 'Semantic', name: 'color/danger/text-default' });
  });

  it('leaves variables that aren’t neutral alone', () => {
    expect(
      mutedColorRule(paint({ variable: color('surface-default') })),
    ).toBeNull();
    expect(
      mutedColorRule(
        paint({
          variable: {
            collection: 'Semantic',
            name: 'color/danger/text-default',
          },
        }),
      ),
    ).toBeNull();
  });

  describe('File upload', () => {
    const fileUpload = { component: 'File upload', path: '/Dropzone' };

    it('removes the drop zone’s background, except on hover', () => {
      expect(
        mutedColorRule(
          paint({
            ...fileUpload,
            variant: 'state=default',
            variable: color('surface-default'),
          }),
        ),
      ).toBe('remove');
      expect(
        mutedColorRule(
          paint({
            ...fileUpload,
            variant: 'state=disabled',
            variable: neutral('surface-tinted'),
          }),
        ),
      ).toBe('remove');
      expect(
        mutedColorRule(
          paint({
            ...fileUpload,
            variant: 'state=hover',
            variable: color('surface-tinted'),
          }),
        ),
      ).toBeNull();
    });

    it('mutes the read-only drop zone', () => {
      const disabled = { ...fileUpload, variant: 'state=disabled' };
      expect(
        mutedColorRule(
          paint({
            ...disabled,
            property: 'stroke',
            variable: neutral('border-subtle'),
          }),
        ),
      ).toEqual(color('border-muted'));
      expect(
        mutedColorRule(
          paint({
            ...disabled,
            path: '/Dropzone/CircleSlash/shape',
            variable: neutral('text-subtle'),
          }),
        ),
      ).toEqual(color('text-muted'));
    });

    it('uses the text color for the drop zone’s description', () => {
      expect(
        mutedColorRule(
          paint({
            ...fileUpload,
            variant: 'state=default',
            path: '/Dropzone/Text and button/Dropzone-Label and description/Dropzone-description',
            property: 'text',
            variable: color('text-subtle'),
          }),
        ),
      ).toEqual(color('text-default'));
    });
  });
});

describe('mutedColorRule variant names', () => {
  it('ignores case, and only counts read-only and readonly as read-only', () => {
    const fileUpload = { component: 'File upload', path: '/Dropzone' };
    expect(
      mutedColorRule(
        paint({
          ...fileUpload,
          variant: 'State=Hover',
          variable: color('surface-tinted'),
        }),
      ),
    ).toBeNull();
    expect(
      mutedColorRule(
        paint({
          ...fileUpload,
          variant: 'State=Disabled',
          property: 'stroke',
          variable: neutral('border-subtle'),
        }),
      ),
    ).toEqual(color('border-muted'));
    const inputText = {
      component: 'Select',
      path: '/input/Left content/Selected/Input text',
      property: 'text' as const,
      variable: neutral('text-default'),
    };
    expect(
      mutedColorRule(paint({ ...inputText, variant: 'state=readonly' })),
    ).toEqual(color('text-muted'));
    expect(
      mutedColorRule(paint({ ...inputText, variant: 'state=already-open' })),
    ).toEqual(color('text-default'));
  });
});

describe('MUTED_COLOR_COMPONENTS', () => {
  it('lists each component once', () => {
    const keys = MUTED_COLOR_COMPONENTS.map(
      ({ page, name }) => `${page}|${name}`,
    );
    expect(new Set(keys).size).toBe(keys.length);
  });
});
