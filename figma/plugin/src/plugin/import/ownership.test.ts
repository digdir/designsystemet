import { describe, expect, it } from 'vitest';
import pkg from '../../../package.json';
import {
  isManaged,
  keptWarning,
  managedModeIds,
  markManaged,
  planModes,
  readImportData,
  setManagedModeIds,
  splitLeftovers,
  updateImportData,
} from './ownership';

/** A stand-in for a Figma variable, style or collection, which keeps its plugin data in a map. */
function pluginDataItem(data: Record<string, string> = {}, name = 'size/base') {
  const store = new Map(Object.entries(data));
  const item = {
    name,
    /** How many times plugin data was written. */
    writes: 0,
    getPluginData: (key: string) => store.get(key) ?? '',
    setPluginData: (key: string, value: string) => {
      store.set(key, value);
      item.writes++;
    },
  };
  return item;
}

const mode = (modeId: string, name: string) => ({ modeId, name });

describe('planModes', () => {
  it("renames a new collection's default mode and adds the rest", () => {
    // syncCollections marks the mode Figma gives a collection it creates.
    expect(
      planModes([mode('1', 'Mode 1')], ['light', 'dark'], new Set(['1'])),
    ).toEqual({
      rename: { mode: mode('1', 'Mode 1'), to: 'light' },
      add: ['dark'],
      remove: [],
      keep: [],
      managed: ['1'],
    });
  });

  it('keeps an unmarked "Mode 1", e.g. in a collection made by hand with a name from the config', () => {
    expect(planModes([mode('1', 'Mode 1')], ['light'], new Set())).toEqual({
      add: ['light'],
      remove: [],
      keep: [mode('1', 'Mode 1')],
      managed: [],
    });
  });

  it('renames an only mode the import created', () => {
    expect(planModes([mode('1', 'old')], ['new'], new Set(['1']))).toEqual({
      rename: { mode: mode('1', 'old'), to: 'new' },
      add: [],
      remove: [],
      keep: [],
      managed: ['1'],
    });
  });

  it('keeps an only mode made by hand instead of renaming it', () => {
    expect(planModes([mode('1', 'Custom')], ['light'], new Set())).toEqual({
      add: ['light'],
      remove: [],
      keep: [mode('1', 'Custom')],
      managed: [],
    });
  });

  it('does not rename an only mode that is already in the config', () => {
    expect(
      planModes([mode('1', 'dark')], ['light', 'dark'], new Set(['1'])),
    ).toEqual({ add: ['light'], remove: [], keep: [], managed: ['1'] });
  });

  it('adds a mode the config lists twice once', () => {
    expect(
      planModes([mode('1', 'light')], ['light', 'dark', 'dark'], new Set()).add,
    ).toEqual(['dark']);
  });

  it('renames one mode when every mode the import created is replaced, as a collection always has a mode', () => {
    expect(
      planModes(
        [mode('1', 'a'), mode('2', 'b')],
        ['c', 'd'],
        new Set(['1', '2']),
      ),
    ).toEqual({
      rename: { mode: mode('1', 'a'), to: 'c' },
      add: ['d'],
      remove: [mode('2', 'b')],
      keep: [],
      managed: ['1'],
    });
  });

  it('removes only the modes the import created', () => {
    const plan = planModes(
      [mode('1', 'light'), mode('2', 'old'), mode('3', 'custom')],
      ['light'],
      new Set(['1', '2']),
    );

    expect(plan.remove).toEqual([mode('2', 'old')]);
    expect(plan.keep).toEqual([mode('3', 'custom')]);
    expect(plan.managed).toEqual(['1']);
  });

  it('takes over the modes in the config in a file without marks, and keeps the rest', () => {
    const plan = planModes(
      [mode('1', 'light'), mode('2', 'dark'), mode('3', 'leftover')],
      ['light', 'dark'],
      new Set(),
    );

    expect(plan).toEqual({
      add: [],
      remove: [],
      keep: [mode('3', 'leftover')],
      managed: ['1', '2'],
    });
  });

  it('changes nothing without modes in the config', () => {
    expect(planModes([mode('1', 'Mode 1')], [], new Set())).toEqual({
      add: [],
      remove: [],
      keep: [],
      managed: [],
    });
  });
});

describe('splitLeftovers', () => {
  it('removes the items the import created that are not in the config, and keeps the rest', () => {
    const items = [
      { name: 'in-config', managed: true },
      { name: 'old', managed: true },
      { name: 'custom', managed: false },
      { name: 'adopted', managed: false },
    ];

    const { remove, keep } = splitLeftovers(
      items,
      new Set(['in-config', 'adopted']),
      { name: (item) => item.name, managed: (item) => item.managed },
    );

    expect(remove.map((item) => item.name)).toEqual(['old']);
    expect(keep.map((item) => item.name)).toEqual(['custom']);
  });
});

describe('plugin data', () => {
  it('marks an item as the import’s, with the plugin version', () => {
    const item = pluginDataItem();
    expect(isManaged(item)).toBe(false);

    markManaged(item);

    expect(isManaged(item)).toBe(true);
    expect(readImportData(item)).toEqual({
      pluginVersion: pkg.version,
      name: 'size/base',
    });
  });

  it('counts an item renamed or duplicated under a new name after the import as made by hand', () => {
    const item = pluginDataItem();
    markManaged(item);

    item.name = 'size/base copy';

    expect(isManaged(item)).toBe(false);
  });

  it('counts an item marked before names were stored as the import’s', () => {
    const item = pluginDataItem({
      import: JSON.stringify({ pluginVersion: '1.0.0' }),
    });

    expect(isManaged(item)).toBe(true);
  });

  it('stores the mode IDs on the collection', () => {
    const collection = pluginDataItem();

    setManagedModeIds(collection, ['1', '2', '1']);

    expect(managedModeIds(collection)).toEqual(new Set(['1', '2']));
  });

  it('keeps fields it does not set, including ones from other plugin versions', () => {
    const item = pluginDataItem({
      import: JSON.stringify({
        pluginVersion: '0.1.0',
        future: 'kept',
      }),
    });

    updateImportData(item, { modes: ['1'] });

    expect(readImportData(item)).toEqual({
      modes: ['1'],
      pluginVersion: pkg.version,
      future: 'kept',
    });
  });

  it('only writes when something changed', () => {
    const item = pluginDataItem();

    markManaged(item);
    markManaged(item);

    expect(item.writes).toBe(1);
  });

  it('reads data that is missing or can’t be read as none', () => {
    for (const data of ['', 'not json', '[1]', 'null', '"text"']) {
      const item = pluginDataItem({ import: data });
      expect(readImportData(item)).toEqual({});
      expect(isManaged(item)).toBe(false);
      expect(managedModeIds(item)).toEqual(new Set());
    }
  });

  it('ignores fields of the wrong type', () => {
    const item = pluginDataItem({
      import: JSON.stringify({ pluginVersion: 1, modes: ['1', 2] }),
    });

    expect(isManaged(item)).toBe(false);
    expect(managedModeIds(item)).toEqual(new Set(['1']));
  });
});

describe('keptWarning', () => {
  it('lists the kept items', () => {
    expect(
      keptWarning({ one: 'mode', many: 'modes' }, ['custom'], 'Theme'),
    ).toBe(
      "Kept 1 mode in Theme that isn't in the config and wasn't created by this plugin: custom",
    );
    expect(
      keptWarning({ one: 'text style', many: 'text styles' }, [
        'typography/a',
        'typography/b',
      ]),
    ).toBe(
      "Kept 2 text styles that aren't in the config and weren't created by this plugin: typography/a, typography/b",
    );
  });
});
