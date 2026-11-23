// The migrations, and running them. The user chooses which to run, previews what they would change, and then
// applies them. Applied migrations are recorded in the file, so the UI can say when each one was applied;
// a migration can still run again, e.g. on components added later, as one that has run finds nothing to change.

import pkg from '../../../package.json';
import type { MigrationInfo, MigrationSummary } from '../../types';
import { createPause, type Pause } from '../import/pause';
import { mutedColors } from './migrations/muted-colors';
import { createVariableIndex, refName } from './rebind';
import type { Migration, MigrationLog } from './types';

/** All migrations, oldest first. Add new ones at the end; they run in this order. */
export const MIGRATIONS: Migration[] = [mutedColors];

const DATA_KEY = 'migrations';

/** What's stored on the document per applied migration, as JSON under one plugin data key. */
type AppliedMigrations = Record<
  string,
  { appliedAt: string; pluginVersion: string }
>;

function readApplied(): AppliedMigrations {
  try {
    const data: unknown = JSON.parse(
      figma.root.getPluginData(DATA_KEY) || '{}',
    );
    return data && typeof data === 'object' ? (data as AppliedMigrations) : {};
  } catch {
    return {};
  }
}

export function listMigrations(): MigrationInfo[] {
  const applied = readApplied();
  return MIGRATIONS.map(({ id, title, description }) => ({
    id,
    title,
    description,
    appliedAt: applied[id]?.appliedAt,
  }));
}

/**
 * Runs the chosen migrations, oldest first. In a dry run nothing is written, and each migration is previewed
 * on the file as it is now, not as the ones before it would leave it.
 */
export async function runMigrations(
  ids: string[],
  dryRun: boolean,
  onDetail: (detail: string) => void = () => {},
): Promise<MigrationSummary[]> {
  const chosen = MIGRATIONS.filter((migration) => ids.includes(migration.id));
  const pause = createPause(onDetail);
  const summaries: MigrationSummary[] = [];

  // Undo takes back all the migrations at once.
  if (!dryRun) figma.commitUndo();
  for (const migration of chosen) {
    summaries.push(await runMigration(migration, dryRun, pause));
  }
  if (!dryRun) {
    figma.commitUndo();
    const applied = readApplied();
    for (const summary of summaries) {
      if (summary.error) continue;
      applied[summary.id] = {
        appliedAt: new Date().toISOString(),
        pluginVersion: pkg.version,
      };
    }
    figma.root.setPluginData(DATA_KEY, JSON.stringify(applied));
  }
  return summaries;
}

async function runMigration(
  migration: Migration,
  dryRun: boolean,
  pause: Pause,
): Promise<MigrationSummary> {
  const log: MigrationLog = { changes: new Map(), warnings: [] };
  const summary = (error?: string): MigrationSummary => ({
    id: migration.id,
    title: migration.title,
    ...summarize(log),
    warnings: log.warnings,
    error,
  });

  const variables = await createVariableIndex();
  const missing = migration.requires.filter((ref) => !variables.find(ref));
  if (missing.length > 0) {
    return summary(
      `This file doesn't have ${missing.map(refName).join(', ')}. Import a config made with the latest theme builder first.`,
    );
  }

  await migration.run({ dryRun, log, pause });
  return summary();
}

/** Groups the changes by component, keeping the order they were found in. */
export function summarize(
  log: MigrationLog,
): Pick<MigrationSummary, 'components' | 'total'> {
  const components: MigrationSummary['components'] = [];
  let total = 0;
  for (const { component, ...change } of log.changes.values()) {
    let entry = components.find((c) => c.name === component);
    if (!entry) {
      entry = { name: component, changes: [] };
      components.push(entry);
    }
    entry.changes.push(change);
    total += change.count;
  }
  return { components, total };
}
