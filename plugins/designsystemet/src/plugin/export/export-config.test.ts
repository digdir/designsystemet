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

    const { config, warnings } = await exportConfig(
      await syncedCollections(themes),
    );

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

    const { config } = await exportConfig(await syncedCollections(themes));

    expect(config.themes).toEqual({
      theme: { colors: { accent: '#0062ba', neutral: '#24272b' } },
    });
  });

  it('writes hex codes in lowercase', async () => {
    const { config } = await exportConfig(
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

    const { config } = await exportConfig(collections);

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

    const { config } = await exportConfig(collections);

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

    const { config, warnings } = await exportConfig(collections);

    expect(config.themes).toEqual(themes);
    expect(warnings).toEqual([]);
  });

  it('warns about collections, modes and variables an import does not create', async () => {
    const collections = await syncedCollections({
      theme: { colors: { accent: '#0062ba', neutral: '#24272b' } },
    });
    const collection = (name: string) => {
      const found = collections.find((c) => c.name === name);
      if (!found) {
        throw new Error(`No ${name} collection`);
      }
      return found;
    };
    collections.push({ name: 'Spacing', modes: ['Mode 1'], variables: [] });
    collection('Color scheme').variables.push({
      name: 'theme/accent/custom',
      valuesByMode: {},
    });
    // Added by hand to collections the config is generated into, not read from.
    collection('Theme').variables.push({ name: 'custom', valuesByMode: {} });
    collection('Size').modes.push('huge');

    const { warnings } = await exportConfig(collections);

    expect(warnings).toEqual([
      `Collection "Spacing" isn't created by an import, so it isn't in the config.`,
      `Mode "Size/huge" isn't created by an import, so it isn't in the config.`,
      `Variable "Theme/custom" isn't created by an import, so it isn't in the config.`,
      `Variable "Color scheme/theme/accent/custom" isn't created by an import, so it isn't in the config.`,
    ]);
  });

  it('warns about collections, modes and variables an import would create that are not in the file', async () => {
    const collections = await syncedCollections({
      theme: { colors: { accent: '#0062ba', neutral: '#24272b' } },
    });
    const byName = (name: string) => {
      const found = collections.find((c) => c.name === name);
      if (!found) {
        throw new Error(`No ${name} collection`);
      }
      return found;
    };
    // Deleted by hand: a variable, a mode, and a whole collection the export doesn't need.
    const theme = byName('Theme');
    theme.variables = theme.variables.filter((v) => v.name !== 'font-family');
    const deletedMode = byName('Size').modes.pop();
    const deletedCollection = collections.findIndex(
      (c) => !['Theme', 'Color scheme', 'Size'].includes(c.name),
    );
    const [{ name: deletedCollectionName }] = collections.splice(
      deletedCollection,
      1,
    );

    const { warnings } = await exportConfig(collections);

    expect(warnings).toHaveLength(3);
    expect(warnings).toEqual(
      expect.arrayContaining([
        `Collection "${deletedCollectionName}" isn't in this file, so importing the config creates it.`,
        `1 mode in Size isn't in this file, so importing the config creates it: ${deletedMode}`,
        `1 variable in Theme isn't in this file, so importing the config creates it: font-family`,
      ]),
    );
  });

  it('warns about a mode named __proto__ outside the Theme collection', async () => {
    const collections = await syncedCollections({
      theme: { colors: { accent: '#0062ba', neutral: '#24272b' } },
    });
    collections.find((c) => c.name === 'Size')?.modes.push('__proto__');

    const { warnings } = await exportConfig(collections);

    expect(warnings).toEqual([
      `Mode "Size/__proto__" isn't created by an import, so it isn't in the config.`,
    ]);
  });

  it('warns about a value that refers to a variable outside the file', async () => {
    const collections = await syncedCollections({
      theme: { colors: { accent: '#0062ba', neutral: '#24272b' } },
    });
    const fontFamily = collections
      .find((c) => c.name === 'Theme')
      ?.variables.find((v) => v.name === 'font-family');
    if (!fontFamily) {
      throw new Error('No font-family variable');
    }
    // As readCollections leaves it: an alias to a library variable, which has no value here.
    delete fontFamily.valuesByMode.theme;
    fontFamily.externalAliasModes = ['theme'];

    const { warnings } = await exportConfig(collections);

    expect(warnings).toEqual([
      'Variable "Theme/font-family" refers to a variable outside this file, such as a library, in theme, so that value isn\'t in the config.',
    ]);
  });

  it('warns about a value edited by hand that the config does not have', async () => {
    const collections = await syncedCollections({
      theme: { colors: { accent: '#0062ba', neutral: '#24272b' } },
    });
    const size = collections.find((c) => c.name === 'Size');
    const variable = size?.variables.find((v) =>
      Object.values(v.valuesByMode).some(
        (value) => value.kind === 'raw' && typeof value.value === 'number',
      ),
    );
    const [mode, value] =
      Object.entries(variable?.valuesByMode ?? {}).find(
        ([, value]) => value.kind === 'raw',
      ) ?? [];
    if (!variable || !mode || value?.kind !== 'raw') {
      throw new Error('No number variable in Size');
    }
    variable.valuesByMode[mode] = {
      kind: 'raw',
      value: (value.value as number) + 1,
    };

    const { warnings } = await exportConfig(collections);

    expect(warnings).toEqual([
      `1 variable in Size has a value the config doesn't have, so importing the config replaces it: ${variable.name} (${mode})`,
    ]);
  });

  it('does not warn about values the config keeps, or that differ only by Figma’s precision', async () => {
    const collections = await syncedCollections({
      theme: { colors: { accent: '#0062ba', neutral: '#24272b' } },
    });
    // A color edited by hand becomes an override, so the config keeps it.
    editColor(collections, 'theme/accent/3', 'Dark', '#123456');
    // Figma stores numbers as 32-bit floats, so they read back slightly off.
    for (const variable of collections.flatMap((c) => c.variables)) {
      for (const value of Object.values(variable.valuesByMode)) {
        if (value.kind === 'raw' && typeof value.value === 'number') {
          value.value = Math.fround(value.value);
        }
      }
    }

    const { warnings } = await exportConfig(collections);

    expect(warnings).toEqual([]);
  });

  it('warns about a color step deleted in Figma, which importing the config generates', async () => {
    const collections = await syncedCollections({
      theme: { colors: { accent: '#0062ba', neutral: '#24272b' } },
    });
    const colorScheme = collections.find((c) => c.name === 'Color scheme');
    colorScheme?.variables.splice(
      colorScheme.variables.findIndex((v) => v.name === 'theme/accent/3'),
      1,
    );

    const { warnings } = await exportConfig(collections);

    expect(warnings).toEqual([
      'Theme "theme": Color "accent" has no surface-default in light, so importing the config generates it from the base color.',
      'Theme "theme": Color "accent" has no surface-default in dark, so importing the config generates it from the base color.',
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

    const { config, warnings } = await exportConfig(collections);

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

    const { config, warnings } = await exportConfig(collections);

    expect(config.themes?.alpha?.overrides).toBeUndefined();
    expect(warnings).toContain(
      `Variable "Color scheme/alpha/accent/constructor" isn't created by an import, so it isn't in the config.`,
    );
  });

  it('throws for a file that no config was imported into', async () => {
    await expect(
      exportConfig([{ name: 'Colors', modes: ['Mode 1'], variables: [] }]),
    ).rejects.toThrow('No "Theme" collection found');
  });
});
