import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { configSchema } from '../schemas/schema.ts';
import { createTokens, getTokenSetDimensions } from './create.ts';
import { cssVariableName } from './css-variables.ts';
import { formatThemeCSS } from './format.ts';
import type { Theme, TokenSet } from './types.ts';

// Custom property declarations, e.g. `  --ds-size-4: ...`. References inside `var()` are not matched.
const CSS_DECLARATION = /^\s*(--ds-[a-z0-9-]+)\s*:/gm;

describe('cssVariableName', () => {
  it('names semantic tokens by their path', () => {
    expect(cssVariableName(['border-radius', 'sm'], 'semantic/style')).toBe('--ds-border-radius-sm');
    expect(cssVariableName(['link', 'color', 'visited'], 'semantic/style')).toBe('--ds-link-color-visited');
    expect(cssVariableName(['color', 'accent', 'background-default'], 'semantic/style')).toBe(
      '--ds-color-accent-background-default',
    );
  });

  it('leaves the color name out inside a data-color scope', () => {
    expect(cssVariableName(['color', 'my-brand', 'base-default'], 'semantic/style', { colorScoped: true })).toBe(
      '--ds-color-base-default',
    );
    expect(cssVariableName(['background-default'], 'semantic/color/accent')).toBe('--ds-color-background-default');
  });

  it('drops the typography group and camel-cases properties like Style Dictionary', () => {
    expect(cssVariableName(['typography', 'heading', '2xl', 'fontSize'], 'semantic/style')).toBe(
      '--ds-heading-2xl-font-size',
    );
    expect(cssVariableName(['typography', 'body', 'long', 'md', 'letterSpacing'], 'semantic/style')).toBe(
      '--ds-body-long-md-letter-spacing',
    );
    expect(cssVariableName(['typography', 'body', 'md', 'fontFamily'], 'semantic/style')).toBeNull();
  });

  it('names the size and type scales from their primitive sets', () => {
    expect(cssVariableName(['_size', '4'], 'primitives/modes/size/global')).toBe('--ds-size-4');
    expect(cssVariableName(['_size', 'mode-font-size'], 'primitives/modes/size/global')).toBe(
      '--ds-size-mode-font-size',
    );
    expect(cssVariableName(['font-size', '3'], 'primitives/modes/typography/size/medium')).toBe('--ds-font-size-3');
    expect(cssVariableName(['font-family'], 'themes/designsystemet')).toBe('--ds-font-family');
  });

  it('returns null for tokens that never become a CSS property', () => {
    expect(cssVariableName(['size', '4'], 'semantic/style')).toBeNull();
    expect(cssVariableName(['color', 'accent', '1'], 'themes/designsystemet')).toBeNull();
    expect(cssVariableName(['border-radius', '3'], 'themes/designsystemet')).toBeNull();
    expect(cssVariableName(['border-radius', 'base'], 'themes/designsystemet')).toBe('--ds-border-radius-base');
    expect(cssVariableName(['size', '_base'], 'primitives/modes/size/medium')).toBeNull();
    expect(cssVariableName(['border-width', '1'], 'primitives/globals')).toBeNull();
    expect(
      cssVariableName(['designsystemet', 'font-family'], 'primitives/modes/typography/primary/designsystemet'),
    ).toBeNull();
  });

  it('accepts a Style Dictionary filePath as the token set', () => {
    expect(cssVariableName(['opacity', 'disabled'], './design-tokens/semantic/style.json')).toBe(
      '--ds-opacity-disabled',
    );
    expect(cssVariableName(['_size', '2'], 'C:\\tokens\\primitives\\modes\\size\\global.json')).toBe('--ds-size-2');
  });
});

/**
 * The naming rules above must describe exactly what `tokens build` outputs. This builds a theme in memory and
 * checks that the set of `--ds-*` properties declared in the CSS equals the set of names this module produces
 * for the generated tokens, in both directions. A new token group, a renamed output or a changed transform
 * fails here until the rules are updated, which keeps the Figma plugin's code syntax in step with the CSS.
 */
describe('cssVariableName matches the tokens build output', () => {
  const themeName = 'test';
  let declared: Set<string>;
  let expected: Set<string>;

  beforeAll(async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const config = configSchema.parse({
      themes: { [themeName]: { colors: { neutral: '#444444', brand: '#0062BA' } } },
    });
    const theme = { name: themeName, ...config.themes[themeName] } as Theme;

    const files = await formatThemeCSS(theme, { verbose: false, tailwind: false });
    const css = files.map((file) => file.output).join('\n');
    declared = new Set(
      [...css.matchAll(CSS_DECLARATION)]
        .map(([, name]) => name)
        // The size-mode helpers (`--ds-size`, `--ds-size--sm`, `--ds-size-mode-font-size--sm`) are hand-written
        // toggles in the size-mode format, not tokens.
        .filter((name) => name !== '--ds-size' && !name.includes('--', 2)),
    );

    const { tokenSets } = await createTokens(theme, getTokenSetDimensions(theme));
    const colorModes = [...tokenSets.keys()]
      .filter((set) => set.startsWith('semantic/color/'))
      .map((set) => set.split('/').at(-1));

    expected = new Set<string>();
    for (const [tokenSet, tokens] of tokenSets) {
      for (const { path, type } of flattenTokens(tokens)) {
        // Typography components are expanded per property by the build, see the `expand` config.
        const paths =
          type === 'typography'
            ? ['fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'fontFamily'].map((prop) => [...path, prop])
            : [path];
        for (const tokenPath of paths) {
          const name = cssVariableName(tokenPath, tokenSet);
          if (name) expected.add(name);
          if (tokenSet === 'semantic/style' && tokenPath[0] === 'color' && colorModes.includes(tokenPath[1])) {
            const scoped = cssVariableName(tokenPath, tokenSet, { colorScoped: true });
            if (scoped) expected.add(scoped);
          }
        }
      }
    }
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('produces every property the build declares, and nothing else', () => {
    expect(declared.size).toBeGreaterThan(200);
    expect([...expected].sort()).toEqual([...declared].sort());
  });
});

const flattenTokens = (tokens: TokenSet, path: string[] = []): { path: string[]; type: string }[] =>
  Object.entries(tokens).flatMap(([key, value]) =>
    '$value' in value
      ? [{ path: [...path, key], type: String(value.$type) }]
      : flattenTokens(value as TokenSet, [...path, key]),
  );
