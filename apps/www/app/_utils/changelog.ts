/**
 * The packages in the changelog, in the order they are shown: by color, see below. The ids are
 * used in the URL of the changelog page, e.g. `/en/changelog?package=css&package=react`.
 * `packageName` is the name of the package in app/content/changelog/changelog.json (written by
 * scripts/group-changelogs.js).
 *
 * The colors group the packages, on the tags under each change and on the filter chips: the
 * styles (CSS and Web, success), React (brand3), Figma (brand1), and the rest (neutral).
 */
export const CHANGELOG_PACKAGES = [
  {
    id: 'css',
    packageName: '@digdir/designsystemet-css',
    label: 'CSS',
    color: 'success',
  },
  {
    id: 'web',
    packageName: '@digdir/designsystemet-web',
    label: 'Web',
    color: 'success',
  },
  {
    id: 'react',
    packageName: '@digdir/designsystemet-react',
    label: 'React',
    color: 'brand3',
  },
  {
    id: 'figma-plugin',
    packageName: 'figma-plugin',
    label: 'Figma plugin',
    color: 'brand1',
  },
  {
    id: 'figma-ui-kit',
    packageName: 'figma-ui-kit',
    label: 'Figma UI kit',
    color: 'brand1',
  },
  {
    id: 'cli',
    packageName: '@digdir/designsystemet',
    label: 'CLI',
    color: 'neutral',
  },
  {
    id: 'types',
    packageName: '@digdir/designsystemet-types',
    label: 'Types',
    color: 'neutral',
  },
  {
    id: 'www',
    packageName: '@web/www',
    label: 'Documentation',
    color: 'neutral',
  },
] as const;

export type ChangelogPackage = (typeof CHANGELOG_PACKAGES)[number];
export type ChangelogPackageId = ChangelogPackage['id'];

export const CHANGE_TYPES = {
  major: 'Major changes',
  minor: 'Minor changes',
  patch: 'Patch changes',
} as const;
export type ChangeType = keyof typeof CHANGE_TYPES;

/** The packages with these ids, in their order. */
export const changelogPackages = (ids: readonly string[]): ChangelogPackage[] =>
  CHANGELOG_PACKAGES.filter(({ id }) => ids.includes(id));

/** The URL of the changelog filtered to the Figma packages, e.g. for links from the Figma docs. */
export const FIGMA_CHANGELOG_SEARCH =
  '?package=figma-ui-kit&package=figma-plugin';
