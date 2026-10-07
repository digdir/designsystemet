import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import pkg from '../../package.json' with { type: 'json' };
import { configSchema, type ExternalConfigSchemaInput } from '../schemas/schema.ts';
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

beforeAll(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

describe('generateConfigFromCSS', () => {
  it('reads designsystemet.css back to the config it is built from', () => {
    const css = readFileSync(new URL('../../../css/theme/designsystemet.css', import.meta.url), 'utf8');
    const rootConfig = JSON.parse(
      readFileSync(new URL('../../../../designsystemet.config.json', import.meta.url), 'utf8'),
    ) as ExternalConfigSchemaInput;

    const { config, warnings } = generateConfigFromCSS({ designsystemet: css });

    expect(config.themes).toEqual(rootConfig.themes);
    expect(warnings).toEqual([]);
  });

  it('reads back a theme with overrides, a font family and a border radius', async () => {
    const theme: ThemeInput = {
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

    const { config, warnings } = generateConfigFromCSS({ test: await buildThemeCSS('test', theme) });

    expect(config.themes).toEqual({ test: theme });
    expect(warnings).toEqual([]);
  });

  it('reads several themes', async () => {
    const first: ThemeInput = { colors: { accent: '#0062ba', neutral: '#24272b' } };
    const second: ThemeInput = { colors: { accent: '#0d7a5f', neutral: '#1e2b3c' }, borderRadius: 0 };

    const { config } = generateConfigFromCSS({
      first: await buildThemeCSS('first', first),
      second: await buildThemeCSS('second', second),
    });

    expect(config.themes).toEqual({ first, second });
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
      `Theme "test": The CSS was built with v0.0.1, and this is v${pkg.version}. Colors the two versions generate differently are kept as overrides.`,
      'Theme "test": Typography set "secondary" uses font family Georgia, but the config has one font family for every set, so IBM Plex Sans from "primary" is used.',
      'Theme "test": --ds-border-radius-base isn\'t a length the config can describe (calc(1px * 4)), so it isn\'t in the config.',
    ]);
  });

  it('throws for CSS that is not theme CSS', () => {
    expect(() => generateConfigFromCSS({ test: '.button { color: red; }' })).toThrow(
      'Theme "test" isn\'t theme CSS built by Designsystemet: it has no "ds.theme.color-scheme.light" layer.',
    );
  });
});
