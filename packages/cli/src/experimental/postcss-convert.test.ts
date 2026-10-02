/**
 * README:
 * Run this file from root by using the command:
 * pnpm vitest run --config=./test/vitest.config.mjs packages/cli/src/experimental/postcss-convert.test.ts
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import postcss from 'postcss';
import { afterAll, describe, expect, it } from 'vitest';
import postcssConvert, { type TokensMessage } from './postcss-convert.ts';

const fixture = (file: string) => path.join(import.meta.dirname, file);
const read = (file: string) => fs.readFileSync(fixture(file), 'utf-8');

/** Run the plugin and return both the CSS and the JSON it produced. `from` resolves relative @import paths */
const convert = async (css: string, from?: string) => {
  const result = await postcss([postcssConvert()]).process(css, { from });
  const json = result.messages.find((message): message is TokensMessage => message.type === 'tokens')?.json;
  if (!json) throw new Error('Plugin did not produce a convert-json message');
  return { css: result.css, json };
};

/** Custom property declarations of the rules containing the selector */
const declsOf = (css: string, selector: string) => {
  const decls: Record<string, string> = {};
  postcss.parse(css).walkRules((rule) => {
    if (!rule.selectors.includes(selector)) return;
    rule.walkDecls((decl) => {
      decls[decl.prop] = decl.value;
    });
  });
  return decls;
};

/**
 * Minimal color scale, so the focused tests do not depend on the full fixture.
 * Colors use plain (non-relative) functions to keep expectations readable.
 */
const MINIMAL = `
:root {
  --ds-border-radius-base: 0.25rem;
  --ds-border-radius-sm: min(var(--ds-border-radius-base) * 0.5, 1rem);
  --ds-spacing-1: 16px;
  --ds-font-family: Inter, sans-serif;
}
:root,
[data-color] {
  --_light: color(from var(--ds-color) srgb-linear r g b);
  --ds-color-base-default--light: var(--_light);
  --ds-color-base-default--dark: color(from var(--_light) srgb-linear calc(1 - r) calc(1 - g) calc(1 - b));
  --ds-color-text-default--light: black;
  --ds-color-text-default--dark: white;
  --ds-color-base-default: light-dark(var(--ds-color-base-default--light), var(--ds-color-base-default--dark));
  --ds-color-text-default: light-dark(var(--ds-color-text-default--light), var(--ds-color-text-default--dark));
}
:root,
[data-color='primary'] {
  --ds-color: #ff0000;
}
[data-color='custom'] {
  --ds-color: rgb(0 0 255);
  --ds-color-base-default--light: blue;
}
`;

describe('postcss-convert', () => {
  it('converts before.css to after.css', async () => {
    const { css } = await convert(read('before.css'), fixture('before.css'));
    expect(css.trim()).toBe(read('after.css').trim());
  });

  it('produces after.json', async () => {
    const { json } = await convert(read('before.css'), fixture('before.css'));
    expect(json).toEqual(JSON.parse(read('after.json')));
  });

  it('augments every rule with --ds-color with --light and --dark variants', async () => {
    const { css } = await convert(MINIMAL);
    const primary = declsOf(css, "[data-color='primary']");

    expect(primary['--ds-color-base-default--light']).toBe('#ff0000');
    expect(primary['--ds-color-base-default--dark']).toBe('#00ffff');
    expect(primary['--ds-color-text-default--light']).toBe('#000000');
    expect(primary['--ds-color-text-default--dark']).toBe('#ffffff');
  });

  it('computes already declared variants to hex as well', async () => {
    const { css, json } = await convert(MINIMAL);
    const custom = declsOf(css, "[data-color='custom']");

    expect(custom['--ds-color-base-default--light']).toBe('#0000ff');
    expect(custom['--ds-color-base-default--dark']).toBe('#ffff00');
    expect(json.color.custom['base-default--light']).toBe('#0000ff');
  });

  it('leaves rules without --ds-color and the shared scale untouched', async () => {
    const { css } = await convert(MINIMAL);
    const shared = declsOf(css, '[data-color]');

    expect(shared['--ds-color-base-default']).toContain('light-dark(');
    expect(shared['--ds-color-base-default--light']).toBe('var(--_light)');
    expect(css).not.toContain('--_light: #');
  });

  it('computes color variables and rem based sizes in the JSON', async () => {
    const { json } = await convert(MINIMAL);

    expect(json.color.primary).toEqual({
      'base-default--light': '#ff0000',
      'base-default--dark': '#00ffff',
      'text-default--light': '#000000',
      'text-default--dark': '#ffffff',
    });
    expect(json['border-radius']).toEqual({ base: 4, sm: 2 });
    expect(json.spacing).toEqual({ 1: 16 });
    expect(json['font-family']).toBeUndefined();
    expect(json.font).toEqual({ family: 'Inter, sans-serif' });
  });

  it('computes CSS math functions such as round()', async () => {
    const { json } = await convert(`
      :root {
        --ds-spacing-unit: calc(1rem / 3);
        --ds-spacing-1: round(down, calc(var(--ds-spacing-unit) * 2), 1px);
        --ds-spacing-2: round(up, var(--ds-spacing-unit) * 2, 1px);
        --ds-spacing-3: round(nearest, 10.6px, 1px);
        --ds-spacing-4: abs(-4px);
        --ds-spacing-5: mod(7px, 3px);
      }
    `);

    expect(json.spacing).toEqual({ unit: 5, 1: 10, 2: 11, 3: 11, 4: 4, 5: 1 });
  });

  it('throws when a size step does not compute to a number', async () => {
    const css = `
      :root, [data-size] { --ds-size: 1; --ds-size-1: round(down, var(--ds-size), 1px); }
      [data-size='sm'] { --ds-size: 2; }
    `;
    await expect(convert(css)).rejects.toThrow(/--ds-size-1/);
  });

  it('only includes --ds- prefixed variables in the JSON', async () => {
    const { json } = await convert(MINIMAL);

    expect(JSON.stringify(json)).not.toContain('--_');
    expect(JSON.stringify(json)).not.toContain('--ds-');
  });

  it('only treats top-level :root as global', async () => {
    const { css, json } = await convert(`
      ${MINIMAL}
      @media (min-width: 300px) {
        :root { --ds-spacing-1: 99px; }
        :not(:root) { --ds-color: tomato; }
      }
      :root .child { --ds-spacing-1: 98px; }
      :not(:root) { --ds-spacing-1: 97px; }
      :root:hover { --ds-spacing-1: 96px; }
      :is(:root) { --ds-spacing-1: 95px; }
      :where([data-color='wrapped']) { --ds-color: lime; }
    `);

    expect(json.spacing).toEqual({ 1: 16 });
    expect(Object.keys(json.color)).toEqual(['primary', 'custom']);
    // Only top-level scale rules are augmented
    expect(declsOf(css, ':not(:root)')['--ds-color-text-default--light']).toBeUndefined();
  });

  it('treats :root and [data-color] inside @layer as top-level', async () => {
    const { json } = await convert(`
      ${MINIMAL}
      @layer ds {
        :root { --ds-spacing-2: 2rem; }
        [data-color='layered'] { --ds-color: red; }
        @media (min-width: 300px) { :root { --ds-spacing-1: 99px; } }
      }
      @layer a { @layer b { :root { --ds-spacing-3: 3rem; } } }
    `);

    // Only one level of @layer counts, so the nested spacing-3 is ignored
    expect(json.spacing).toEqual({ 1: 16, 2: 32 });
    expect(json.color.layered['text-default--light']).toBe('#000000');
  });

  it('computes size steps per [data-size] scale, leaving the CSS as written', async () => {
    const input = `
      :root,
      [data-size] {
        --ds-size: 1;
        --ds-size-unit: calc(1rem * var(--ds-size));
        --ds-size-0: calc(var(--ds-size-unit) * 0);
        --ds-size-1: calc(var(--ds-size-unit) * 1);
        --ds-size-2: calc(var(--ds-size-unit) * 2);
      }
      [data-size='sm'] { --ds-size: 0.5; }
      [data-size='lg'] { --ds-size: 1.25; --ds-size-2: 99px; }
      @media (min-width: 300px) { [data-size='hidden'] { --ds-size: 2; } }
    `;
    const { css, json } = await convert(input);

    expect(json.size).toEqual({
      sm: { 0: 0, 1: 8, 2: 16 },
      lg: { 0: 0, 1: 20, 2: 99 },
    });
    expect(json.unit).toBeUndefined();
    expect(css).toBe(input);
  });

  describe('@import', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'postcss-convert-'));
    const write = (file: string, css: string) => {
      fs.writeFileSync(path.join(dir, file), css);
      return path.join(dir, file);
    };
    afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

    it('reads local imports for tokens, leaving the @import as written', async () => {
      write('tokens.css', ':root { --ds-spacing-1: 1rem; }');
      write(
        'nested.css',
        [
          "@import 'tokens.css' layer(ds);",
          ':root { --ds-spacing-2: 2rem; }',
          ':root, [data-size] { --ds-size: 1; --ds-size-1: calc(1rem * var(--ds-size)); }',
          "[data-size='imported'] { --ds-size: 2; }",
        ].join('\n'),
      );
      const input = [
        "@import url('./nested.css');",
        "@import url('https://example.com/remote.css');",
        "@import url('./nested.css') screen;",
        ':root { --ds-spacing-3: 3rem; }',
      ].join('\n');
      const from = write('entry.css', input);
      const { css, json } = await convert(input, from);

      expect(json.spacing).toEqual({ 1: 16, 2: 32, 3: 48 });
      expect(json.size).toEqual({ imported: { 1: 32 } });
      expect(css).toBe(input);
    });

    it('throws on circular imports', async () => {
      write('a.css', "@import 'b.css';");
      const from = write('b.css', "@import 'a.css';");
      await expect(convert(fs.readFileSync(from, 'utf-8'), from)).rejects.toThrow(/circular @import/i);
    });
  });

  it('throws on circular custom properties', async () => {
    const css = `
      :root, [data-color] {
        --_a: var(--_b);
        --_b: var(--_a);
        --ds-color-text-default--light: var(--_a);
      }
      [data-color='primary'] { --ds-color: red; }
    `;
    await expect(convert(css)).rejects.toThrow(/circular/i);
  });

  it('throws on colors that cannot be computed', async () => {
    const css = `
      :root, [data-color] { --ds-color-text-default--light: var(--nope); }
      [data-color='primary'] { --ds-color: red; }
    `;
    await expect(convert(css)).rejects.toThrow(/--nope/);
  });
});
