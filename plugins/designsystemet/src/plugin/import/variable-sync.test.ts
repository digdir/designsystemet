import { describe, expect, it } from 'vitest';
import { createImportLog } from './log';
import { managedModeIds } from './ownership';
import type { Pause } from './pause';
import { ensureModes } from './variable-sync';

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
