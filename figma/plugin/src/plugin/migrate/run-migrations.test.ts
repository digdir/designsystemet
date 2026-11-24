import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  listMigrations,
  MIGRATIONS,
  runMigrations,
  summarize,
} from './run-migrations';
import type { MigrationLog } from './types';

describe('MIGRATIONS', () => {
  it('have unique IDs', () => {
    const ids = MIGRATIONS.map((migration) => migration.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('summarize', () => {
  it('groups the changes by component, sorts the components by name and totals them', () => {
    const log: MigrationLog = { changes: new Map(), warnings: [] };
    const add = (page: string, what: string, count: number) =>
      log.changes.set(`${page}|${what}`, {
        page,
        what,
        from: 'a',
        to: 'b',
        count,
      });
    add('Divider', 'Border', 1);
    add('Dialog', 'Fill', 2);
    add('Dialog', 'Border', 3);

    expect(summarize(log)).toEqual({
      total: 6,
      components: [
        {
          name: 'Dialog',
          changes: [
            { what: 'Fill', from: 'a', to: 'b', count: 2 },
            { what: 'Border', from: 'a', to: 'b', count: 3 },
          ],
        },
        {
          name: 'Divider',
          changes: [{ what: 'Border', from: 'a', to: 'b', count: 1 }],
        },
      ],
    });
  });
});

describe('runMigrations', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // A file with no pages, and no variables unless given.
  function stubEmptyFile(
    variables: Array<{
      id: string;
      name: string;
      variableCollectionId: string;
    }> = [],
  ) {
    let pluginData = '';
    const commitUndo = vi.fn();
    vi.stubGlobal('figma', {
      commitUndo,
      root: {
        children: [],
        getPluginData: () => pluginData,
        setPluginData: (_key: string, value: string) => {
          pluginData = value;
        },
      },
      variables: {
        getLocalVariableCollectionsAsync: async () => [
          { id: 'color', name: 'Color', modes: [] },
        ],
        getLocalVariablesAsync: async () => variables,
      },
    });
    return { commitUndo };
  }

  it('doesn’t run a migration whose variables are missing', async () => {
    stubEmptyFile();

    const [summary] = await runMigrations(['muted-colors'], false);

    expect(summary.error).toMatch(/doesn't have Color\/surface-muted/);
    expect(summary.total).toBe(0);
    expect(listMigrations()[0].appliedAt).toBeUndefined();
  });

  it('records the migrations it applied, and groups them in one undo step', async () => {
    const { commitUndo } = stubEmptyFile(
      ['surface-muted', 'border-muted', 'text-muted'].map((name) => ({
        id: name,
        name,
        variableCollectionId: 'color',
      })),
    );

    const [summary] = await runMigrations(['muted-colors'], false);

    expect(summary.error).toBeUndefined();
    // The file has none of the UI kit's pages.
    expect(summary.warnings.length).toBeGreaterThan(0);
    expect(commitUndo).toHaveBeenCalledTimes(2);
    expect(listMigrations()[0].appliedAt).toEqual(expect.any(String));
  });

  const MUTED_VARIABLES = ['surface-muted', 'border-muted', 'text-muted'].map(
    (name) => ({ id: name, name, variableCollectionId: 'color' }),
  );

  // Records the order of undo steps and plugin data writes on the stubbed figma global.
  function recordCalls(): string[] {
    const calls: string[] = [];
    const stub = (globalThis as unknown as { figma: PluginAPI }).figma;
    const setPluginData = stub.root.setPluginData.bind(stub.root);
    stub.commitUndo = () => calls.push('commitUndo') && undefined;
    stub.root.setPluginData = (key, value) => {
      calls.push('setPluginData');
      setPluginData(key, value);
    };
    return calls;
  }

  it('writes the record inside the undo step, so Undo takes it back with the changes', async () => {
    stubEmptyFile(MUTED_VARIABLES);
    const calls = recordCalls();

    await runMigrations(['muted-colors'], false);

    expect(calls).toEqual(['commitUndo', 'setPluginData', 'commitUndo']);
  });

  it('closes the undo step and says how to undo when a migration fails partway', async () => {
    stubEmptyFile();
    const calls = recordCalls();
    MIGRATIONS.push({
      id: 'test-fails',
      title: 'Fails',
      description: '',
      requires: [],
      run: async () => {
        throw new Error('Layer is locked');
      },
    });

    try {
      await expect(runMigrations(['test-fails'], false)).rejects.toThrow(
        'Layer is locked. Some components may already have changed. Use Undo in Figma to take the changes back.',
      );
    } finally {
      MIGRATIONS.pop();
    }
    expect(calls).toEqual(['commitUndo', 'commitUndo']);
    expect(listMigrations().find((m) => m.id === 'test-fails')).toBeUndefined();
  });

  it('only runs the chosen migrations', async () => {
    stubEmptyFile();

    expect(await runMigrations([], true)).toEqual([]);
  });

  it('doesn’t write anything in a dry run', async () => {
    const { commitUndo } = stubEmptyFile();

    await runMigrations(['muted-colors'], true);

    expect(commitUndo).not.toHaveBeenCalled();
    expect(listMigrations()[0].appliedAt).toBeUndefined();
  });
});
