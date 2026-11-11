import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CollectionSpec } from './collection-specs';
import { createImportLog } from './log';
import { isManaged, managedModeIds } from './ownership';
import type { Pause } from './pause';
import { ensureModes, syncCollections, syncVariables } from './variable-sync';

const noPause: Pause = async () => {};

/** A stand-in for a Figma variable collection that, like Figma, refuses to add modes past a limit. */
function fakeCollection(modeNames: string[], modeLimit: number) {
  let nextId = 0;
  const modes = modeNames.map((name) => ({ modeId: `m${nextId++}`, name }));
  const pluginData = new Map<string, string>();
  return {
    name: 'Theme',
    modes,
    renameMode(modeId: string, name: string) {
      const mode = modes.find((m) => m.modeId === modeId);
      if (mode) mode.name = name;
    },
    addMode(name: string) {
      if (modes.length >= modeLimit) {
        throw new Error('Limited to 2 modes only');
      }
      const modeId = `m${nextId++}`;
      modes.push({ modeId, name });
      return modeId;
    },
    removeMode(modeId: string) {
      modes.splice(
        modes.findIndex((m) => m.modeId === modeId),
        1,
      );
    },
    getPluginData: (key: string) => pluginData.get(key) ?? '',
    setPluginData: (key: string, value: string) => {
      pluginData.set(key, value);
    },
  };
}

describe('ensureModes', () => {
  it('keeps the modes it made marked when a later change fails', async () => {
    const collection = fakeCollection(['Mode 1'], 2);
    // As syncCollections marks the mode Figma gives a collection it creates.
    collection.setPluginData(
      'import',
      JSON.stringify({ pluginVersion: '1.0.0', modes: ['m0'] }),
    );

    await expect(
      ensureModes(
        collection as unknown as VariableCollection,
        ['light', 'dark', 'contrast'],
        createImportLog(),
        noPause,
      ),
    ).rejects.toThrow('Limited to 2 modes only');

    // The renamed default mode and the added "dark" are the import's, so a later import can remove them.
    expect(collection.modes.map((m) => m.name)).toEqual(['light', 'dark']);
    expect(managedModeIds(collection)).toEqual(new Set(['m0', 'm1']));
  });

  it.each([
    { from: ['a', 'b'], to: ['a', 'c'] },
    { from: ['a', 'b'], to: ['c', 'd'] },
  ])(
    'replaces modes in a collection at the mode limit: $from -> $to',
    async ({ from, to }) => {
      const collection = fakeCollection(from, 2);
      collection.setPluginData(
        'import',
        JSON.stringify({ pluginVersion: '1.0.0', modes: ['m0', 'm1'] }),
      );

      await ensureModes(
        collection as unknown as VariableCollection,
        to,
        createImportLog(),
        noPause,
      );

      expect(collection.modes.map((m) => m.name)).toEqual(to);
    },
  );

  it('forgets the modes it removed once every change is done', async () => {
    const collection = fakeCollection(['light', 'old'], 10);
    collection.setPluginData(
      'import',
      JSON.stringify({ pluginVersion: '1.0.0', modes: ['m0', 'm1'] }),
    );

    await ensureModes(
      collection as unknown as VariableCollection,
      ['light'],
      createImportLog(),
      noPause,
    );

    expect(collection.modes.map((m) => m.name)).toEqual(['light']);
    expect(managedModeIds(collection)).toEqual(new Set(['m0']));
  });
});

describe('syncCollections', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const spec: CollectionSpec = {
    name: 'Theme',
    modeNames: ['light', 'dark'],
    variables: new Map(),
  };

  it('renames the mode Figma gives a collection it creates', async () => {
    const created = fakeCollection(['Mode 1'], 10);
    vi.stubGlobal('figma', {
      variables: {
        getLocalVariableCollectionsAsync: async () => [],
        createVariableCollection: () => created,
      },
    });

    await syncCollections([spec], createImportLog(), noPause);

    expect(created.modes.map((m) => m.name)).toEqual(['light', 'dark']);
    expect(managedModeIds(created)).toEqual(new Set(['m0', 'm1']));
  });

  it('keeps an unmarked "Mode 1" in a collection made by hand with a name from the config', async () => {
    const madeByHand = fakeCollection(['Mode 1'], 10);
    vi.stubGlobal('figma', {
      variables: {
        getLocalVariableCollectionsAsync: async () => [madeByHand],
      },
    });
    const log = createImportLog();

    await syncCollections([spec], log, noPause);

    expect(madeByHand.modes.map((m) => m.name)).toEqual([
      'Mode 1',
      'light',
      'dark',
    ]);
    expect(managedModeIds(madeByHand)).toEqual(new Set(['m1', 'm2']));
    expect(log.warnings).toEqual([
      "Kept 1 mode in Theme that isn't in the config and wasn't created by this plugin: Mode 1",
    ]);
  });
});

describe('syncVariables', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('marks a new variable before writing its values, so a failed write leaves it marked', async () => {
    const pluginData = new Map<string, string>();
    const created = {
      name: 'size/base',
      resolvedType: 'FLOAT',
      variableCollectionId: 'collection',
      codeSyntax: {},
      scopes: [],
      valuesByMode: {},
      setValueForMode: () => {
        throw new Error('Figma closed the plugin');
      },
      getPluginData: (key: string) => pluginData.get(key) ?? '',
      setPluginData: (key: string, value: string) => {
        pluginData.set(key, value);
      },
    };
    vi.stubGlobal('figma', {
      variables: {
        getLocalVariablesAsync: async () => [],
        createVariable: () => created,
      },
    });
    const collection = {
      id: 'collection',
      name: 'Size',
      modes: [{ modeId: 'm0', name: 'medium' }],
    } as unknown as VariableCollection;
    const spec: CollectionSpec = {
      name: 'Size',
      modeNames: ['medium'],
      variables: new Map([
        [
          'size/base',
          {
            name: 'size/base',
            type: 'FLOAT',
            codeSyntax: null,
            scopes: [],
            valuesByMode: new Map([['medium', { kind: 'raw', value: 18 }]]),
          },
        ],
      ]),
    };

    await expect(
      syncVariables(
        [spec],
        new Map([['Size', collection]]),
        createImportLog(),
        noPause,
      ),
    ).rejects.toThrow('Figma closed the plugin');

    expect(isManaged(created)).toBe(true);
  });
});
