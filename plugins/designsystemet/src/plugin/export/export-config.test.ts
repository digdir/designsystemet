import { semanticColorSpec } from '@digdir/designsystemet/internal';
import { describe, expect, it } from 'vitest';
import { buildCollectionSpecs } from '../import/collection-specs';
import { createTokenModel } from '../import/create-token-model';
import { createImportLog } from '../import/log';
import { getTokenSetLookupOrder } from '../import/resolver';
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

  it('throws for a file that no config was imported into', () => {
    expect(() =>
      exportConfig([{ name: 'Colors', modes: ['Mode 1'], variables: [] }]),
    ).toThrow('No "Theme" collection found');
  });
});
