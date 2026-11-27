/**
 * The shape of changelog.json at the root of the repo. scripts/group-changelogs.js writes and
 * checks it, and the changelog page on www shows it.
 */

export type ChangeType = 'major' | 'minor' | 'patch';

export type Change = {
  type: ChangeType;
  /** Package names, e.g. `@digdir/designsystemet-css`, see changelog-packages.ts */
  packages: string[];
  markdown: string;
  /**
   * The lines the changeset generator writes before the change, one for each first-time
   * contributor, as paragraphs
   */
  thanks?: string;
};

export type Release = {
  version: string;
  /** The release date as `YYYY-MM-DD`, see changelog-dates.js */
  date?: string;
  /** The date the Figma file was published as `YYYY-MM-DD`, written by hand, see figma/README.md */
  figmaPublished?: string;
  /** Markdown written by hand, e.g. to introduce the release, without headings */
  notes?: string;
  changes: Change[];
};

/** Newest version first */
export type Changelog = { releases: Release[] };
