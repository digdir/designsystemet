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
  it('groups the changes by component and totals them', () => {
    const log: MigrationLog = { changes: new Map(), warnings: [] };
    const add = (component: string, what: string, count: number) =>
      log.changes.set(`${component}|${what}`, {
        component,
        what,
        from: 'a',
        to: 'b',
        count,
      });
    add('Dialog', 'Fill', 2);
    add('Divider', 'Border', 1);
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
