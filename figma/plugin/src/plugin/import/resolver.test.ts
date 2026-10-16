import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildCollectionSpecs } from './collection-specs';
import { createTokenModel } from './create-token-model';
import { createImportLog } from './log';
import { evaluateMath, getTokenSetLookupOrder } from './resolver';

describe('evaluateMath', () => {
  it('evaluates token math', () => {
    expect(evaluateMath('floor(18 / 4 * 2)')).toBe(9);
    expect(evaluateMath('min(8 * 0.5, 4 * 2)')).toBe(4);
    expect(evaluateMath('round(-2 + .5)')).toBe(-1);
    expect(evaluateMath('1e-7 * 10')).toBe(1e-6);
  });

  it.each([
    'figma.closePlugin()',
    'probe(1 + 2)',
    '(1).constructor',
    'max(1, 2).toString()',
    'Math.max(1, 2)',
    'minmax(1)',
    'this',
    '',
  ])('returns null for %j, which is not token math', (expression) => {
    expect(evaluateMath(expression)).toBeNull();
  });
});

describe('importing a config', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('never runs a value from the config as code', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const probe = vi.fn((value: unknown) => value);
    vi.stubGlobal('probe', probe);

    // The font family is free text, and it contains a reference that resolves to a number,
    // so it reaches the token math.
    const model = await createTokenModel(
      JSON.stringify({
        themes: {
          test: {
            colors: { accent: '#0062ba', neutral: '#24272b' },
            typography: { fontFamily: 'probe(2 + {border-radius.6})' },
          },
        },
      }),
    );
    buildCollectionSpecs(
      model,
      getTokenSetLookupOrder(model),
      createImportLog(),
    );

    expect(probe).not.toHaveBeenCalled();
  });
});
