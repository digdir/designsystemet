// Migrations update layers in a copy of the UI kit when a release changes which variables its components use,
// e.g. when components stop using the neutral color. An import only updates variables and styles, so layers
// bound to variables that are no longer the right ones need a migration.
//
// A migration can run as a preview, which changes nothing and lists what it would do, and then for real.

import type { MigrationChangeSummary } from '../../types';
import type { Pause } from '../import/pause';

/** A variable as a migration sees it: its collection's name and its own name, e.g. `Color` and `border-muted`. */
export type VariableRef = {
  collection: string;
  name: string;
};

/** One kind of change in a component, e.g. Textfield's borders going from neutral border-default to border-muted. */
export type MigrationChange = MigrationChangeSummary & { component: string };

/** What a migration found and did. */
export type MigrationLog = {
  /** The changes, each with how many layers it applies to. Added with `countChange`. */
  changes: Map<string, MigrationChange>;
  /** What was skipped or could not be done, e.g. a component that isn't in the file. */
  warnings: string[];
};

export type MigrationContext = {
  /** When true, nothing is written; the log lists what would change. */
  dryRun: boolean;
  log: MigrationLog;
  pause: Pause;
};

export type Migration = {
  /** Stable ID, stored in the file when the migration has been applied. Never change it. */
  id: string;
  title: string;
  /** What the migration does, shown before it runs. */
  description: string;
  /** Variables that must exist in the file before the migration can run, e.g. ones a newer config adds. */
  requires: VariableRef[];
  run: (context: MigrationContext) => Promise<void>;
};
