import { severityColors } from '@digdir/designsystemet/internal';
import LZString from 'lz-string';
import { describe, expect, it } from 'vitest';
import { readLegacyUrl } from './legacy-url';
import { resolveThemeColors } from './theme-colors';
import { defaultWorkspace, normalizeConfig } from './theme-workspace';

/**
 * Pins what an old theme builder link resolves to: every step of every color in light and dark.
 * Shared links must keep giving the same colors, so these tests guard changes to how the URL is read.
 */
const resolveUrl = (search: string) => {
  const workspace = readLegacyUrl(new URLSearchParams(search));
  if (!workspace) throw new Error('The URL holds no theme');
  const colors = resolveThemeColors(
    workspace.config.themes[workspace.activeTheme],
  );

  return Object.fromEntries(
    colors.map((color) => [
      color.name,
      Object.fromEntries(
        Object.values(color.colors.light).map((step) => [
          step.name,
          `${step.hex} ${color.colors.dark[step.name].hex}`,
        ]),
      ),
    ]),
  );
};

const base = 'colors=accent:%230062BA+neutral:%231E2B3C';

describe('theme builder URL', () => {
  // The snapshots were made with the code that read the URL before the theme moved to the theme store
  it('resolves colors, and adds the default severity colors last', () => {
    const resolved = resolveUrl(base);

    expect(Object.keys(resolved)).toEqual([
      'accent',
      'neutral',
      'info',
      'success',
      'warning',
      'danger',
    ]);
    expect(resolved).toMatchSnapshot();
  });

  it('replaces a severity color', () => {
    const resolved = resolveUrl(`${base}&severity=danger:%23AA0000`);

    expect(resolved.danger).not.toEqual(resolveUrl(base).danger);
    expect(resolved.info).toEqual(resolveUrl(base).info);
    expect(resolved.danger).toMatchSnapshot();
  });

  it('overrides a step in one mode and keeps the generated color in the other', () => {
    const resolved = resolveUrl(
      `${base}&color-overrides=accent|border-default|dark:%23112233`,
    );
    const [light, dark] = resolved.accent['border-default'].split(' ');

    expect(light).toBe(resolveUrl(base).accent['border-default'].split(' ')[0]);
    expect(dark).toBe('#112233');
  });

  it('overrides several steps, in both modes, across colors', () => {
    const resolved = resolveUrl(
      `${base}&color-overrides=accent|text-subtle|light:%23111111|dark:%23eeeeee+neutral|surface-tinted|light:%23fafafa`,
    );

    expect(resolved.accent['text-subtle']).toBe('#111111 #eeeeee');
    expect(resolved.neutral['surface-tinted'].split(' ')[0]).toBe('#fafafa');
  });

  it('overrides a step of a default severity color', () => {
    const resolved = resolveUrl(
      `${base}&color-overrides=danger|text-default|light:%23550000`,
    );

    expect(resolved.danger['text-default'].split(' ')[0]).toBe('#550000');
    expect(resolved.danger['base-default']).toBe(
      resolveUrl(base).danger['base-default'],
    );
  });

  it('overrides base-default without changing the base color the scale is generated from', () => {
    const resolved = resolveUrl(
      `${base}&color-overrides=accent|base-default|light:%23ff0000`,
    );
    const { 'base-default': baseDefault, ...rest } = resolved.accent;
    const { 'base-default': _, ...generated } = resolveUrl(base).accent;

    expect(baseDefault.split(' ')[0]).toBe('#ff0000');
    expect(rest).toEqual(generated);
  });

  it('ignores an override for a color that is not in the theme', () => {
    expect(
      resolveUrl(
        `${base}&color-overrides=missing|text-default|light:%23000000`,
      ),
    ).toEqual(resolveUrl(base));
  });

  it('reads the theme a link holds, with severity colors as colors of the theme', () => {
    const theme = (search: string) => {
      const workspace = readLegacyUrl(new URLSearchParams(search));
      return workspace?.config.themes[workspace.activeTheme];
    };

    expect(
      theme(
        `${base}&severity=danger:%23AA0000&border-radius=12&color-overrides=accent|text-subtle|dark:%23eeeeee&appearance=dark&tab=examples`,
      ),
    ).toEqual({
      colors: {
        accent: '#0062BA',
        neutral: '#1E2B3C',
        ...severityColors,
        danger: '#AA0000',
      },
      borderRadius: 12,
      overrides: {
        colors: { accent: { 'text-subtle': { dark: '#eeeeee' } } },
      },
    });
    expect(theme(base)).toEqual({
      colors: { accent: '#0062BA', neutral: '#1E2B3C', ...severityColors },
    });
  });

  it('reads the oldest links, with main, support and neutral', () => {
    const workspace = readLegacyUrl(
      new URLSearchParams(
        'main=accent:%230062BA&support=brand1:%23F45F63+brand2:%23E5AA20&neutral=%231E2B3C',
      ),
    );

    expect(workspace?.config.themes.theme.colors).toEqual({
      accent: '#0062BA',
      brand1: '#F45F63',
      brand2: '#E5AA20',
      neutral: '#1E2B3C',
      ...severityColors,
    });
  });

  it('keeps the default colors when a link only holds other parts of a theme', () => {
    const workspace = readLegacyUrl(new URLSearchParams('border-radius=8'));

    expect(workspace?.config.themes.theme).toEqual({
      ...defaultWorkspace().config.themes.theme,
      borderRadius: 8,
    });
  });

  it('holds no theme when the URL only has view settings', () => {
    expect(readLegacyUrl(new URLSearchParams(''))).toBeNull();
    expect(
      readLegacyUrl(new URLSearchParams('tab=examples&appearance=dark')),
    ).toBeNull();
  });

  describe('with a compressed config', () => {
    const config = {
      outDir: './custom-tokens',
      themes: {
        first: { colors: { accent: '#123456', neutral: '#333333' } },
        second: {
          colors: { accent: '#654321', neutral: '#444444' },
          borderRadius: 2,
        },
      },
    };
    const compress = (value: unknown) =>
      LZString.compressToEncodedURIComponent(JSON.stringify(value));

    it('reads the whole config and the active theme', () => {
      const expected = normalizeConfig(config);
      expect(expected.outDir).toBe(config.outDir);
      expect(expected.themes.second.colors).toEqual({
        ...config.themes.second.colors,
        ...severityColors,
      });

      expect(
        readLegacyUrl(
          new URLSearchParams({ config: compress(config), theme: 'second' }),
        ),
      ).toEqual({ config: expected, activeTheme: 'second' });
      expect(
        readLegacyUrl(new URLSearchParams({ config: compress(config) })),
      ).toEqual({ config: expected, activeTheme: 'first' });
    });

    it('rejects a config that is corrupt, invalid or has an unknown active theme', () => {
      const urls: Record<string, string>[] = [
        { config: 'broken' },
        { config: '' },
        { config: compress({ themes: { first: { colors: 'red' } } }) },
        { config: compress({ outDir: './tokens' }) },
        { config: compress(config), theme: 'missing' },
      ];
      for (const params of urls) {
        expect(() => readLegacyUrl(new URLSearchParams(params))).toThrow(
          'Invalid theme builder URL',
        );
      }
    });
  });
});
