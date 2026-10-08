import type { ValueSpec } from '../types';

// The variables in a Figma file as plain data. Exporting a config works on this instead of the
// Figma API, so it can run (and be tested) without Figma; `readCollections` reads it from Figma.

export type CollectionData = {
  name: string;
  /** Mode names, in Figma's order. The first is the collection's default mode. */
  modes: string[];
  variables: VariableData[];
};

export type VariableData = {
  name: string;
  /** Keyed by mode name. Aliases name their target by collection and variable name, as in an import. */
  valuesByMode: Record<string, ValueSpec>;
  /**
   * Modes whose value is an alias to a variable outside the file, e.g. from a library. They have no value in
   * `valuesByMode`, as the config can't refer to such a variable.
   */
  externalAliasModes?: string[];
};
