import { describe, expect, it } from 'vitest';
import { buildCollectionSpecs } from './collection-specs';
import { createTokenModel } from './create-token-model';
import { createImportLog } from './log';
import { getTokenSetLookupOrder } from './resolver';

async function specsFor(config: object) {
  const model = await createTokenModel(JSON.stringify(config));
  const log = createImportLog();
  const specs = buildCollectionSpecs(model, getTokenSetLookupOrder(model), log);
  return { specs, log };
}

const config = {
  themes: {
    alpha: { colors: { accent: '#0062ba', neutral: '#24272b' } },
    beta: { colors: { accent: '#c2410c', neutral: '#1e2b3c' } },
  },
};

describe('buildCollectionSpecs', () => {
  it('only aliases variables the import creates', async () => {
    const { specs, log } = await specsFor(config);
    const names = new Set(
      specs.flatMap((spec) =>
        [...spec.variables.keys()].map((name) => `${spec.name}/${name}`),
      ),
    );

    const dangling = specs.flatMap((spec) =>
      [...spec.variables.values()].flatMap((variable) =>
        [...variable.valuesByMode.values()]
          .filter(
            (value) =>
              value.kind === 'alias' &&
              !names.has(`${value.collection}/${value.name}`),
          )
          .map(() => `${spec.name}/${variable.name}`),
      ),
    );

    expect(dangling).toEqual([]);
    expect(log.warnings).toEqual([]);
  });

  it('has the color scales, named by step, in Theme, where the Color collection aliases them', async () => {
    const { specs } = await specsFor(config);
    const variable = (collection: string, name: string) =>
      specs.find((spec) => spec.name === collection)?.variables.get(name);

    expect(
      variable('Color', 'background-default')?.valuesByMode.get('accent'),
    ).toEqual({
      kind: 'alias',
      collection: 'Theme',
      name: 'color/accent/background-default',
    });
    const step = variable('Theme', 'color/accent/base-default');
    expect(step?.scopes).toEqual(['ALL_SCOPES']);
    expect(step?.codeSyntax).toBe('var(--ds-color-accent-base-default)');
    expect(step?.valuesByMode.get('beta')).toEqual({
      kind: 'alias',
      collection: 'Color scheme',
      name: 'beta/accent/base-default',
    });
    expect(variable('Semantic', 'color/accent/base-default')).toBeUndefined();
  });
});
