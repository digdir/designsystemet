import { describe, expect, it } from 'vitest';
import { buildCollectionSpecs } from './collection-specs';
import { createTokenModel } from './create-token-model';
import { createImportLog } from './log';
import { getTokenSetLookupOrder } from './resolver';

describe('createTokenModel', () => {
  // Themes can have different colors. Every theme gets all of them, and a color a theme doesn't have uses the
  // theme's first color, so themes and colors can be switched with modes in Figma.
  it('gives themes with different colors every color, falling back to their first color', async () => {
    const model = await createTokenModel(
      JSON.stringify({
        themes: {
          theme1: {
            colors: {
              accent: '#0062BA',
              brand1: '#0D7A5F',
              neutral: '#24272B',
            },
          },
          theme2: {
            colors: { private: '#0062BA', neutral: '#1E2B3C' },
          },
        },
      }),
    );
    const log = createImportLog();
    const specs = buildCollectionSpecs(
      model,
      getTokenSetLookupOrder(model),
      log,
    );
    const theme = specs.find((spec) => spec.name === 'Theme');
    const aliasesByMode = (name: string) =>
      Object.fromEntries(theme?.variables.get(name)?.valuesByMode ?? []);

    expect(specs.find((spec) => spec.name === 'Color')?.modeNames).toEqual([
      'accent',
      'brand1',
      'neutral',
      'private',
      'info',
      'success',
      'warning',
      'danger',
    ]);
    expect(aliasesByMode('color/brand1/1')).toEqual({
      theme1: {
        kind: 'alias',
        collection: 'Color scheme',
        name: 'theme1/brand1/1',
      },
      theme2: {
        kind: 'alias',
        collection: 'Color scheme',
        name: 'theme2/private/1',
      },
    });
    expect(aliasesByMode('color/private/1')).toEqual({
      theme1: {
        kind: 'alias',
        collection: 'Color scheme',
        name: 'theme1/accent/1',
      },
      theme2: {
        kind: 'alias',
        collection: 'Color scheme',
        name: 'theme2/private/1',
      },
    });
    expect(log.warnings).toEqual([]);
  });
});
