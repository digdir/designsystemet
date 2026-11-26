import { describe, expect, it } from 'vitest';
import type { PaintContext } from '../rebind';
import {
  clearNeutralMode,
  closeButtonIconRule,
  MUTED_COLOR_COMPONENTS,
  mutedColorRule,
} from './muted-colors';

const neutral = (step: string) => ({
  collection: 'Semantic',
  name: `color/neutral/${step}`,
});
const color = (name: string) => ({ collection: 'Color', name });

const paint = (overrides: Partial<PaintContext>): PaintContext => ({
  page: 'Dialog',
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

  it('mutes the checkmark, radio dot and switch thumb when read-only', () => {
    const indicators = [
      [
        '.input checkbox',
        'check=checked, type=read-only',
        '/.Scalable checkmark/medium/shape',
      ],
      [
        '.input checkbox',
        'check=intermediate, type=read-only',
        '/intermediate',
      ],
      ['.input radio', 'checked=true, type=read-only', '/indicator'],
      ['.switch base component', 'State=read-only, Checked=true', '/sirkel'],
    ];
    for (const [component, variant, path] of indicators) {
      expect(
        mutedColorRule(
          paint({
            component,
            variant,
            path,
            variable: neutral('text-default'),
          }),
        ),
      ).toEqual(color('text-muted'));
    }
    // Not when the input isn't read-only.
    expect(
      mutedColorRule(
        paint({
          component: '.switch base component',
          variant: 'State=default, Checked=false',
          path: '/sirkel',
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

  it('uses the text color for option descriptions in Suggestion, also in its instances of them', () => {
    for (const [component, path] of [
      [
        '.Item in suggestion',
        '/Checkbox and label/label and description/description',
      ],
      [
        '.Item in multiselect',
        '/Checkbox and label/label and description/description',
      ],
      [
        'Suggestion',
        '/List/Option 1/Checkbox and label/label and description/description',
      ],
    ]) {
      expect(
        mutedColorRule(
          paint({
            page: 'Suggestion',
            component,
            path,
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
          page: 'Suggestion',
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

  it('uses the same step, not the muted ones, in components that only got neutral from base.css', () => {
    for (const [page, component, step] of [
      ['Card', '_Header', 'border-subtle'],
      ['Card', '_Content', 'border-default'],
      ['Details', '.Details.Header', 'surface-default'],
      ['Typography', 'Paragraph', 'text-default'],
    ]) {
      expect(
        mutedColorRule(paint({ page, component, variable: neutral(step) })),
      ).toEqual(color(step));
    }
    // Subtle text gets the text color, as base.css gives it.
    for (const [page, component] of [
      ['Card', '_Header'],
      ['Avatar stack', 'Avatar stack'],
    ]) {
      expect(
        mutedColorRule(
          paint({ page, component, variable: neutral('text-subtle') }),
        ),
      ).toEqual(color('text-default'));
    }
    // The same base component name on the Dialog page still gets the muted steps.
    expect(
      mutedColorRule(
        paint({
          page: 'Dialog',
          component: '_Header',
          variable: neutral('border-subtle'),
        }),
      ),
    ).toEqual(color('border-muted'));
  });

  it('keeps the same step in the UI kit’s helpers and internal icons, subtle text too', () => {
    for (const [page, component, step] of [
      ['Base components', '.Browser', 'text-subtle'],
      ['Base components', '_⚙️Component header', 'border-subtle'],
      ['Icons', '.INTERNAL ICONS', 'text-default'],
    ]) {
      expect(
        mutedColorRule(paint({ page, component, variable: neutral(step) })),
      ).toEqual(color(step));
    }
  });

  it('uses the muted steps for the slot placeholder, also in instances of it', () => {
    const slot = [
      { page: 'Base components', component: '.Slot component', path: '' },
      {
        page: 'Card',
        component: '_Content',
        path: '/.Slot component/container/Erstatt med eget innhold',
      },
    ];
    for (const where of slot) {
      expect(
        mutedColorRule(
          paint({ ...where, variable: neutral('border-default') }),
        ),
      ).toEqual(color('border-muted'));
      expect(
        mutedColorRule(paint({ ...where, variable: neutral('text-subtle') })),
      ).toEqual(color('text-muted'));
      expect(
        mutedColorRule(
          paint({ ...where, variable: neutral('surface-default') }),
        ),
      ).toEqual(color('surface-default'));
    }
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

describe('mutedColorRule for Dialog’s close button', () => {
  it('moves the neutral text-default on the icon to text-subtle, and leaves other text as text-default', () => {
    const at = (path: string) =>
      mutedColorRule(
        paint({
          component: '_Header',
          path,
          variable: neutral('text-default'),
        }),
      );
    expect(at('/close button/Icon button/Icon/shape')).toEqual(
      color('text-subtle'),
    );
    expect(at('/content/Heading')).toEqual(color('text-default'));
  });
});

describe('closeButtonIconRule', () => {
  it('binds the hard-coded color in Dialog’s close button icon to text-subtle', () => {
    const at = (page: string, path: string) =>
      closeButtonIconRule({ page, component: '_Header', variant: '', path });
    expect(at('Dialog', '/close button/Icon button/Icon/shape/shape')).toEqual(
      color('text-subtle'),
    );
    expect(at('Dialog', '/content/Heading')).toBeNull();
    expect(at('Card', '/close button/Icon button/Icon/shape/shape')).toBeNull();
  });
});

describe('clearNeutralMode', () => {
  it('clears the neutral color mode, and no other modes', () => {
    expect(clearNeutralMode({ collection: 'Color', mode: 'neutral' })).toBe(
      true,
    );
    expect(clearNeutralMode({ collection: 'Color', mode: 'accent' })).toBe(
      false,
    );
    expect(
      clearNeutralMode({ collection: 'Color scheme', mode: 'neutral' }),
    ).toBe(false);
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
