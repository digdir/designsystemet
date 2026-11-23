import { afterEach, describe, expect, it, vi } from 'vitest';
import { createTokenModel } from './create-token-model';
import { syncEffectStyles } from './effect-styles';
import { createImportLog } from './log';
import { getTokenSetLookupOrder } from './resolver';

/** A stand-in for a Figma effect style, which keeps its plugin data in a map. */
function fakeStyle(name: string, pluginData: Record<string, string> = {}) {
  const data = new Map(Object.entries(pluginData));
  return {
    name,
    effects: [] as Effect[],
    remove: vi.fn(),
    getPluginData: (key: string) => data.get(key) ?? '',
    setPluginData: (key: string, value: string) => {
      data.set(key, value);
    },
  };
}

describe('syncEffectStyles', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('deletes a style it created that is not in the config, and keeps one renamed by hand', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const model = await createTokenModel(
      JSON.stringify({
        themes: { t: { colors: { accent: '#0062ba', neutral: '#24272b' } } },
      }),
    );
    // Created by an earlier import, and no longer in the config.
    const obsolete = fakeStyle('shadow/old', {
      import: JSON.stringify({ pluginVersion: '1.0.0', name: 'shadow/old' }),
    });
    // Created by an earlier import, then renamed by hand to build on it: it's the user's now.
    const renamed = fakeStyle('My shadow', {
      import: JSON.stringify({ pluginVersion: '1.0.0', name: 'shadow/xs' }),
    });
    const madeByHand = fakeStyle('Card shadow');
    vi.stubGlobal('figma', {
      getLocalEffectStylesAsync: async () => [obsolete, renamed, madeByHand],
      createEffectStyle: () => fakeStyle(''),
    });
    const log = createImportLog();

    await syncEffectStyles(model, getTokenSetLookupOrder(model), log);

    expect(obsolete.remove).toHaveBeenCalled();
    expect(renamed.remove).not.toHaveBeenCalled();
    expect(madeByHand.remove).not.toHaveBeenCalled();
    expect(log.warnings).toEqual([]);
  });
});
