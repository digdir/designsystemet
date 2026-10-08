import { semanticColorSpec } from '@digdir/designsystemet/internal';
import { describe, expect, it } from 'vitest';
import { buildCollectionSpecs } from '../import/collection-specs';
import { createTokenModel } from '../import/create-token-model';
import { createImportLog } from '../import/log';
import { getTokenSetLookupOrder } from '../import/resolver';
import type { ValueSpec } from '../types';
import { exportConfig } from './export-config';
import type { CollectionData } from './types';

/** The collections an import of `themes` creates in Figma, as `readCollections` would read them back. */
async function syncedCollections(themes: object): Promise<CollectionData[]> {
  const model = await createTokenModel(JSON.stringify({ themes }));
  const specs = buildCollectionSpecs(
    model,
    getTokenSetLookupOrder(model),
    createImportLog(),
  );
  return specs.map((spec) => ({
    name: spec.name,
    modes: spec.modeNames,
    variables: [...spec.variables.values()].map((variable) => ({
      name: variable.name,
      valuesByMode: Object.fromEntries(variable.valuesByMode),
    })),
  }));
}

/** Sets a raw color in the Color scheme collection, as if edited by hand in Figma. */
function editColor(
  collections: CollectionData[],
  variableName: string,
  mode: 'Light' | 'Dark',
  hex: string,
) {
  const variable = collections
    .find((c) => c.name === 'Color scheme')
    ?.variables.find((v) => v.name === variableName);
  if (!variable) {
    throw new Error(`No variable ${variableName}`);
  }
  const [r, g, b] = [1, 3, 5].map(
    (i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255,
  );
  variable.valuesByMode[mode] = { kind: 'raw', value: { r, g, b, a: 1 } };
}

describe('exportConfig', () => {
  it('returns the config the file was synced from', async () => {
    const themes = {
      alpha: {
        colors: { accent: '#0062ba', brand: '#5b3fa0', neutral: '#24272b' },
        typography: { fontFamily: 'Roboto' },
        borderRadius: 8,
        overrides: {
          severity: { danger: '#b00020' },
          colors: {
            accent: {
              'background-tinted': { light: '#eef5ff', dark: '#101828' },
            },
            danger: { 'text-subtle': { light: '#8a1c1c' } },
          },
          linkVisited: { light: '#551a8b' },
          focus: { outer: { dark: '#ffffff' } },
        },
      },
      beta: {
        colors: { accent: '#0d7a5f', brand: '#7a1f2b', neutral: '#24272b' },
      },
    };

    const { config, warnings } = exportConfig(await syncedCollections(themes));

    expect(config.themes).toEqual(themes);
    expect(warnings).toEqual([]);
  });

  it('leaves out values that are the defaults', async () => {
    const themes = {
      theme: {
        colors: { accent: '#0062ba', neutral: '#24272b' },
        typography: { fontFamily: 'Inter' },
        borderRadius: 4,
      },
    };

    const { config } = exportConfig(await syncedCollections(themes));

    expect(config.themes).toEqual({
      theme: { colors: { accent: '#0062ba', neutral: '#24272b' } },
    });
  });

  it('writes hex codes in lowercase', async () => {
    const { config } = exportConfig(
      await syncedCollections({
        theme: {
          colors: { accent: '#0062BA', neutral: '#24272B' },
          overrides: { severity: { danger: '#B00020' } },
        },
      }),
    );

    expect(config.themes).toEqual({
      theme: {
        colors: { accent: '#0062ba', neutral: '#24272b' },
        overrides: { severity: { danger: '#b00020' } },
      },
    });
  });

  it('turns colors edited in Figma into overrides', async () => {
    const collections = await syncedCollections({
      theme: { colors: { accent: '#0062ba', neutral: '#24272b' } },
    });
    editColor(collections, 'theme/accent/3', 'Dark', '#123456');

    const { config } = exportConfig(collections);

    expect(config.themes?.theme.overrides).toEqual({
      colors: { accent: { 'surface-default': { dark: '#123456' } } },
    });
  });

  it('resolves an alias within a collection in the same mode, as Figma does', async () => {
    const collections = await syncedCollections({
      alpha: { colors: { accent: '#0062ba', neutral: '#24272b' } },
    });
    const colorScheme = collections.find((c) => c.name === 'Color scheme');
    const variable = (step: keyof typeof semanticColorSpec) =>
      colorScheme?.variables.find(
        (v) => v.name === `alpha/accent/${semanticColorSpec[step].number}`,
      );
    // background-default is white in Light and dark in Dark, so the mode an alias resolves in shows.
    const background = variable('background-default');
    const text = variable('text-default');
    if (!background || !text) {
      throw new Error('No accent variables');
    }
    // Point text-default at background-default in both modes, as if aliased by hand in Figma. Both, as only
    // the mode that isn't the collection's first one shows the difference.
    const alias = {
      kind: 'alias',
      collection: 'Color scheme',
      name: background.name,
    } as const;
    text.valuesByMode.Light = alias;
    text.valuesByMode.Dark = alias;

    const { config } = exportConfig(collections);

    const toHex = (spec: ValueSpec | undefined) => {
      if (spec?.kind !== 'raw' || typeof spec.value !== 'object') {
        throw new Error('Not a raw color');
      }
      const { r, g, b } = spec.value as RGBA;
      return `#${[r, g, b]
        .map((n) =>
          Math.round(n * 255)
            .toString(16)
            .padStart(2, '0'),
        )
        .join('')}`;
    };
    expect(
      config.themes?.alpha?.overrides?.colors?.accent?.['text-default'],
    ).toEqual({
      light: toHex(background.valuesByMode.Light),
      dark: toHex(background.valuesByMode.Dark),
    });
  });

  it('reads steps named by step name as well as by number', async () => {
    const themes = {
      theme: {
        colors: { accent: '#0062ba', neutral: '#24272b' },
        overrides: {
          colors: { accent: { 'border-subtle': { light: '#abcdef' } } },
        },
      },
    };
    const collections = await syncedCollections(themes);
    // Rename `theme/accent/12` to `theme/accent/base-default`, and so on, as planned for future imports.
    const nameByNumber = new Map(
      Object.values(semanticColorSpec).map((step) => [
        String(step.number),
        step.name,
      ]),
    );
    for (const variable of collections.find((c) => c.name === 'Color scheme')
      ?.variables ?? []) {
      variable.name = variable.name.replace(
        /\/(\d+)$/,
        (_match, number) => `/${nameByNumber.get(number) ?? number}`,
      );
    }

    const { config, warnings } = exportConfig(collections);

    expect(config.themes).toEqual(themes);
    expect(warnings).toEqual([]);
  });

  it('warns about collections and variables an import does not create', async () => {
    const collections = await syncedCollections({
      theme: { colors: { accent: '#0062ba', neutral: '#24272b' } },
    });
    collections.push({ name: 'Spacing', modes: ['Mode 1'], variables: [] });
    collections
      .find((c) => c.name === 'Color scheme')
      ?.variables.push({ name: 'theme/accent/custom', valuesByMode: {} });

    const { warnings } = exportConfig(collections);

    expect(warnings).toEqual([
      `Collection "Spacing" isn't created by an import, so it isn't in the config.`,
      `Variable "Color scheme/theme/accent/custom" isn't created by an import, so it isn't in the config.`,
    ]);
  });

  it('keeps themes named like properties every object has, but warns about __proto__', async () => {
    const colors = { accent: '#0062ba', neutral: '#24272b' };
    // Imported with placeholder names, then renamed in the data, as if the theme modes were renamed in Figma.
    // JSON.parse adds `__proto__` as an own property, like a mode name read from Figma.
    const collections = JSON.parse(
      JSON.stringify(
        await syncedCollections({ 'name-a': { colors }, 'name-b': { colors } }),
      )
        .replaceAll('name-a', 'constructor')
        .replaceAll('name-b', '__proto__'),
    ) as CollectionData[];

    const { config, warnings } = exportConfig(collections);

    expect(Object.keys(config.themes ?? {})).toEqual(['constructor']);
    expect(config.themes?.constructor).toEqual({ colors });
    expect(warnings).toContain(
      'Theme "__proto__" isn\'t in the config, as a config can\'t have a theme with that name. Rename the mode in the Theme collection to include it.',
    );
  });

  it('does not read a variable named like a property every object has as a color step', async () => {
    const collections = await syncedCollections({
      alpha: { colors: { accent: '#0062ba', neutral: '#24272b' } },
    });
    collections
      .find((c) => c.name === 'Color scheme')
      ?.variables.push({
        name: 'alpha/accent/constructor',
        valuesByMode: {
          Light: { kind: 'raw', value: { r: 1, g: 0, b: 0, a: 1 } },
        },
      });

    const { config, warnings } = exportConfig(collections);

    expect(config.themes?.alpha?.overrides).toBeUndefined();
    expect(warnings).toContain(
      `Variable "Color scheme/alpha/accent/constructor" isn't created by an import, so it isn't in the config.`,
    );
  });

  it('throws for a file that no config was imported into', () => {
    expect(() =>
      exportConfig([{ name: 'Colors', modes: ['Mode 1'], variables: [] }]),
    ).toThrow('No "Theme" collection found');
  });
});
