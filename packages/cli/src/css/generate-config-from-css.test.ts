import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import pkg from '../../package.json' with { type: 'json' };
import { configSchema, type ExternalConfigSchemaInput } from '../schemas/schema.ts';
import { generateColorScheme } from '../tokens/create/generators/primitives/color-scheme.ts';
import { formatThemeCSS } from '../tokens/format.ts';
import type { Theme } from '../tokens/types.ts';
import { generateConfigFromCSS } from './generate-config-from-css.ts';

type ThemeInput = NonNullable<ExternalConfigSchemaInput['themes']>[string];

/** The theme CSS that `tokens build` creates from a theme in the public config. */
async function buildThemeCSS(name: string, input: ThemeInput): Promise<string> {
  const config = configSchema.parse({ themes: { [name]: input } });
  const theme = { name, ...config.themes?.[name] } as Theme;
  const files = await formatThemeCSS(theme, { verbose: false, tailwind: false });
  return files.map((file) => file.output).join('\n');
}

// A theme with every kind of color override, a font family and a border radius.
const themeWithOverrides: ThemeInput = {
  colors: { accent: '#0062ba', 'my-brand': '#5b3fa0', neutral: '#24272b' },
  typography: { fontFamily: 'IBM Plex Sans' },
  borderRadius: 8,
  overrides: {
    colors: {
      accent: { 'background-tinted': { light: '#ff0000' } },
      'my-brand': { 'text-default': { light: '#111111', dark: '#eeeeee' } },
    },
    severity: { danger: '#aa0000' },
    linkVisited: { light: '#123456' },
    focus: { outer: { dark: '#abcdef' } },
  },
};
// A second theme with the same color names, as every theme in a config needs.
const plainTheme: ThemeInput = {
  colors: { accent: '#0d7a5f', 'my-brand': '#8a1c4a', neutral: '#1e2b3c' },
  borderRadius: 0,
};

const builtCSS: Record<string, string> = {};

/** The colors building a theme gives, in light and dark: every scale, the visited link color and the focus colors. */
function builtColors(input: ThemeInput) {
  const theme = configSchema.parse({ themes: { theme: input } }).themes?.theme;
  if (!theme) {
    throw new Error('No theme');
  }
  return {
    light: generateColorScheme('theme', 'light', theme.colors, theme.overrides),
    dark: generateColorScheme('theme', 'dark', theme.colors, theme.overrides),
  };
}

/** What a read back theme has besides its colors, which are compared by the colors they build. */
function withoutColors({ colors: _colors, overrides, ...theme }: ThemeInput) {
  const { colors: _overrideColors, severity: _severity, ...otherOverrides } = overrides ?? {};
  return { ...theme, ...(Object.keys(otherOverrides).length > 0 && { overrides: otherOverrides }) };
}

// Building theme CSS takes a few seconds per theme, more on a busy CI runner, so each theme is built once
// here with a timeout to match, rather than in the tests.
beforeAll(async () => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  builtCSS.withOverrides = await buildThemeCSS('with-overrides', themeWithOverrides);
  builtCSS.plain = await buildThemeCSS('plain', plainTheme);
}, 30_000);

describe('generateConfigFromCSS', () => {
  it('reads designsystemet.css back to a config that builds the same colors', () => {
    const css = readFileSync(new URL('../../../css/theme/designsystemet.css', import.meta.url), 'utf8');
    const rootConfig = JSON.parse(
      readFileSync(new URL('../../../../designsystemet.config.json', import.meta.url), 'utf8'),
    ) as ExternalConfigSchemaInput;
    const rootTheme = rootConfig.themes?.designsystemet as ThemeInput;

    const { config, warnings } = generateConfigFromCSS({ designsystemet: css });
    const theme = config.themes?.designsystemet as ThemeInput;

    // Compared after parsing, which adds the default severity colors, as the read back config leaves them out.
    const colorNames = (input: ThemeInput) =>
      Object.keys(configSchema.parse({ themes: { theme: input } }).themes?.theme.colors ?? {});
    expect(colorNames(theme)).toEqual(colorNames(rootTheme));
    expect(builtColors(theme)).toEqual(builtColors(rootTheme));
    expect(withoutColors(theme)).toEqual(withoutColors(rootTheme));
    expect(warnings).toEqual([]);
  });

  it('reads back a theme with overrides, a font family and a border radius', () => {
    const { config, warnings } = generateConfigFromCSS({ 'with-overrides': builtCSS.withOverrides });
    const theme = config.themes?.['with-overrides'] as ThemeInput;

    expect(builtColors(theme)).toEqual(builtColors(themeWithOverrides));
    expect(withoutColors(theme)).toEqual(withoutColors(themeWithOverrides));
    expect(warnings).toEqual([]);
  });

  it('writes each color as its base color, with only the steps that differ, without color or severity overrides', () => {
    const { config } = generateConfigFromCSS({ 'with-overrides': builtCSS.withOverrides });
    const theme = config.themes?.['with-overrides'] as ThemeInput;

    // The default severity colors are left out; danger isn't the default, so it's in the colors.
    expect(theme.colors).toEqual({
      accent: { 'background-tinted': { light: '#ff0000' }, 'base-default': { light: '#0062ba' } },
      'my-brand': { 'text-default': { light: '#111111', dark: '#eeeeee' }, 'base-default': { light: '#5b3fa0' } },
      neutral: '#24272b',
      danger: '#aa0000',
    });
    expect(Object.keys(theme.colors.accent)).toEqual(['background-tinted', 'base-default']);
    expect(theme.overrides).toEqual({ linkVisited: { light: '#123456' }, focus: { outer: { dark: '#abcdef' } } });
  });

  it('leaves a color step missing from the CSS out of the color, so importing the config generates it', () => {
    // Removes the first declaration, which is in the light color scheme.
    const css = builtCSS.withOverrides.replace(/--ds-color-accent-surface-tinted:[^;]*;/, '');

    const { config, warnings } = generateConfigFromCSS({ 'with-overrides': css });
    const accent = config.themes?.['with-overrides']?.colors.accent;

    expect(accent).not.toHaveProperty('surface-tinted');
    expect(accent).toHaveProperty(['background-tinted', 'light'], '#ff0000');
    expect(warnings).toEqual([
      'Theme "with-overrides": Color "accent" has no surface-tinted in light, so it\'s left out of the config, and importing the config generates it from the base color.',
    ]);
  });

  it('warns about a focus color missing from the CSS, which importing the config sets to the default', () => {
    // Removes the first declaration, which is in the light color scheme.
    const css = builtCSS.plain.replace(/--ds-color-focus-inner:[^;]*;/, '');

    const { warnings } = generateConfigFromCSS({ plain: css });

    expect(warnings).toEqual([
      'Theme "plain": The inner focus color has no value in light, so importing the config uses the default.',
    ]);
  });

  it('reads several themes', () => {
    const { config } = generateConfigFromCSS({
      'with-overrides': builtCSS.withOverrides,
      plain: builtCSS.plain,
    });

    expect(Object.keys(config.themes ?? {})).toEqual(['with-overrides', 'plain']);
    expect(builtColors(config.themes?.plain as ThemeInput)).toEqual(builtColors(plainTheme));
    expect(withoutColors(config.themes?.plain as ThemeInput)).toEqual(withoutColors(plainTheme));
  });

  it('warns about what the config cannot describe', () => {
    const css = `
      /* build: v0.0.1 */
      @layer ds.theme.color-scheme.light {
        :root {
          --ds-color-neutral-base-default: #24272b;
          --ds-color-accent-base-default: rgb(0 98 186);
        }
      }
      @layer ds.theme.typography.primary { :root { --ds-font-family: 'IBM Plex Sans', sans-serif; } }
      @layer ds.theme.typography.secondary { [data-typography="secondary"] { --ds-font-family: Georgia; } }
      @layer ds.theme.semantic { :root { --ds-border-radius-base: calc(1px * 4); } }
    `;

    const { config, warnings } = generateConfigFromCSS({ test: css });

    expect(config.themes?.test?.typography).toEqual({ fontFamily: 'IBM Plex Sans' });
    expect(warnings).toEqual([
      'Theme "test": --ds-color-accent-base-default in light isn\'t a hex color (rgb(0 98 186)), so it isn\'t in the config.',
      `Theme "test": The CSS was built with v0.0.1, and this is v${pkg.version}. The config keeps the colors from the CSS, but building it with this version may change other values.`,
      'Theme "test": Color "neutral" has only its base color in light, so the other steps are left out of the config, and importing the config generates them from the base color.',
      'Theme "test": Color "neutral" has no colors in dark, so they\'re left out of the config, and importing the config generates them from the base color.',
      'Theme "test": The visited link color has no value in light and dark, so importing the config uses the default.',
      'Theme "test": The inner focus color has no value in light and dark, so importing the config uses the default.',
      'Theme "test": The outer focus color has no value in light and dark, so importing the config uses the default.',
      'Theme "test": Typography set "secondary" uses font family Georgia, but the config has one font family for every set, so IBM Plex Sans from "primary" is used.',
      'Theme "test": --ds-border-radius-base isn\'t a length the config can describe (calc(1px * 4)), so it isn\'t in the config.',
    ]);
  });

  it('refuses color names a config cannot have, so they cannot reach Object.prototype', () => {
    const css = `
      @layer ds.theme.color-scheme.light {
        :root {
          --ds-color-neutral-base-default: #24272b;
          --ds-color-__proto__-base-default: #0062ba;
          --ds-color-__proto__-background-tinted: #ff0000;
          --ds-color-constructor-base-default: #0d7a5f;
          constructor: #ffffff;
        }
      }
    `;

    const { config, warnings } = generateConfigFromCSS({ test: css });

    expect(({} as Record<string, unknown>)['background-tinted']).toBeUndefined();
    expect(config.themes?.test?.colors).toEqual({
      neutral: '#24272b',
      constructor: '#0d7a5f',
    });
    expect(warnings).toContain(
      'Theme "test": Color "__proto__" isn\'t a valid color name (only a-z, 0-9 and -), so it isn\'t in the config.',
    );
  });

  it('throws for CSS that is not theme CSS', () => {
    expect(() => generateConfigFromCSS({ test: '.button { color: red; }' })).toThrow(
      'Theme "test" isn\'t theme CSS built by Designsystemet: it has no "ds.theme.color-scheme.light" layer.',
    );
  });
});
