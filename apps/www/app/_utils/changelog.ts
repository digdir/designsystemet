// The packages are listed in scripts/, since scripts/group-changelogs.ts uses the list as well
export {
  CHANGELOG_PACKAGES,
  type ChangelogPackage,
  type ChangelogPackageId,
} from '../../../../scripts/changelog-packages';

import {
  CHANGELOG_PACKAGES,
  type ChangelogPackage,
} from '../../../../scripts/changelog-packages';

// The types of change and their headings are in scripts/ as well, with the shape of changelog.json
export {
  CHANGE_HEADINGS,
  type ChangeType,
} from '../../../../scripts/changelog-types';

/** The packages with these ids, in their order. */
export const changelogPackages = (ids: readonly string[]): ChangelogPackage[] =>
  CHANGELOG_PACKAGES.filter(({ id }) => ids.includes(id));
