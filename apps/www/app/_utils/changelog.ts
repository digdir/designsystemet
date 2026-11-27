// The packages are listed in scripts/, since scripts/group-changelogs.js uses the list as well
export {
  CHANGELOG_PACKAGES,
  type ChangelogPackage,
  type ChangelogPackageId,
} from '../../../../scripts/changelog-packages';

import {
  CHANGELOG_PACKAGES,
  type ChangelogPackage,
} from '../../../../scripts/changelog-packages';

export const CHANGE_TYPES = {
  major: 'Major changes',
  minor: 'Minor changes',
  patch: 'Patch changes',
} as const;
export type ChangeType = keyof typeof CHANGE_TYPES;

/** The packages with these ids, in their order. */
export const changelogPackages = (ids: readonly string[]): ChangelogPackage[] =>
  CHANGELOG_PACKAGES.filter(({ id }) => ids.includes(id));
