/**
 * Builds the changelog page for www from changelog.json, where each change is listed once with the
 * packages it affects. The page lists every package, and can be filtered by package, see
 * apps/www/app/routes/changelog/changelog.tsx. changelog.json is built by
 * scripts/group-changelogs.js; this file only formats it as MDX and writes it.
 *
 * It runs when the release pull request is made, and again in the www deploy, so edits to
 * changelog.json reach www with the next deploy (see azure-deploy-www.yml).
 *
 * The MDX uses these components, so the page can filter and style the changes:
 *
 *   <Release version="1.24.1" date="2026-11-18" figmaPublished="2026-11-19" packages="cli,css">
 *     <ReleaseNotes> markdown </ReleaseNotes>      only when the version has notes
 *     <Changes type="patch" packages="cli,css">
 *       <Change packages="cli,css"> markdown </Change>
 *     </Changes>
 *   </Release>
 */
import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  CHANGE_TYPES,
  parseMarkdown,
  readChangelog,
  releaseNotes,
  toMarkdown,
} from './group-changelogs.js';

const ROOT = process.cwd();
export const CHANGELOG_MDX = path.join(
  ROOT,
  'apps/www/app/content/changelog/changelog.mdx',
);

// The ids used for the packages on www, in the filters and the URL
const PACKAGE_IDS = {
  '@digdir/designsystemet': 'cli',
  '@digdir/designsystemet-css': 'css',
  '@digdir/designsystemet-react': 'react',
  '@digdir/designsystemet-web': 'web',
  '@digdir/designsystemet-types': 'types',
  'figma-plugin': 'figma-plugin',
  'figma-ui-kit': 'figma-ui-kit',
  '@web/www': 'www',
};
const PACKAGE_ORDER = Object.values(PACKAGE_IDS);

/**
 * The ids of the packages, in a fixed order and without duplicates, e.g. `cli,css`. changelog.json
 * can be edited by hand, so a package without an id keeps only the characters a package name can
 * have, and can never end the attribute it is written in.
 * @param {string[]} names
 */
const packageIds = (names) =>
  [
    ...new Set(
      names.map((name) => PACKAGE_IDS[name] ?? name.replace(/[^\w@/.-]/g, '')),
    ),
  ]
    .sort((a, b) => PACKAGE_ORDER.indexOf(a) - PACKAGE_ORDER.indexOf(b))
    .join(',');

/** Only `YYYY-MM-DD`, for the same reason */
const isDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date ?? '');

function git(args) {
  try {
    return execFileSync('git', args, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

/**
 * The release date of a version as `YYYY-MM-DD`: the commit date of the aggregated `v<version>`
 * tag, or of the first commit that added the `## <version>` heading to a package changelog.
 * Returns null for the version being prepared, which has neither yet: its release commit is the
 * pull request this runs in, and that can stay open for weeks. It is dated at deploy time instead,
 * see scripts/date-latest-changelog.js. Needs the full git history and tags, see `fetch-depth`
 * in release.yml and azure-deploy-www.yml.
 *
 * With `tagOnly`, only the tag is used. The newest version is dated that way: in a preview deploy
 * of the release pull request, its heading is already committed, so the changelog would date a
 * version that is not released yet.
 */
function getReleaseDate(version, { tagOnly = false } = {}) {
  const fromTag = git(['log', '-1', '--format=%cs', `refs/tags/v${version}`]);
  if (fromTag || tagOnly) return fromTag || null;

  // Anchored, so `## 1.0.0` does not also match the `## 1.0.0-next.1` pre-release headings.
  const heading = `^## ${version.replaceAll('.', '\\.')}$`;
  const fromChangelog = git([
    'log',
    '--reverse',
    '--format=%cs',
    `-G${heading}`,
    '--',
    'packages/*/CHANGELOG.md',
  ]).split('\n')[0];
  return fromChangelog || null;
}

/** @param {import('./group-changelogs.js').Change} change */
const formatChange = ({ packages, markdown, thanks }) =>
  `<Change packages="${packageIds(packages)}">\n\n${toMarkdown([
    ...(thanks ? parseMarkdown(thanks).children : []),
    ...parseMarkdown(markdown).children,
  ])}\n\n</Change>\n\n`;

/**
 * @param {import('./group-changelogs.js').Release} release
 * @param {string | null} date as `YYYY-MM-DD`. A version without a date is dated at deploy time,
 * see scripts/date-latest-changelog.js.
 */
function formatRelease(release, date) {
  const { version, figmaPublished, changes } = release;
  const attributes = [`version="${version}"`];
  if (isDate(date)) attributes.push(`date="${date}"`);
  if (isDate(figmaPublished))
    attributes.push(`figmaPublished="${figmaPublished}"`);
  attributes.push(
    `packages="${packageIds(changes.flatMap((change) => change.packages))}"`,
  );

  let out = `<Release ${attributes.join(' ')}>\n\n`;
  const notes = toMarkdown(releaseNotes(release));
  if (notes) out += `<ReleaseNotes>\n\n${notes}\n\n</ReleaseNotes>\n\n`;
  for (const type of CHANGE_TYPES) {
    const entries = changes.filter((change) => change.type === type);
    if (entries.length === 0) continue;
    const packages = packageIds(entries.flatMap((entry) => entry.packages));
    out += `<Changes type="${type}" packages="${packages}">\n\n${entries.map(formatChange).join('')}</Changes>\n\n`;
  }
  return `${out}</Release>\n\n`;
}

async function main() {
  // Only `x.y.z`, for the same reason as packageIds
  const releases = (await readChangelog()).releases.filter(({ version }) =>
    /^\d+\.\d+\.\d+$/.test(version),
  );
  const latestVersion = releases[0]?.version;

  let content = '';
  for (const release of releases) {
    content += formatRelease(
      release,
      getReleaseDate(release.version, {
        tagOnly: release.version === latestVersion,
      }),
    );
  }

  await fs.mkdir(path.dirname(CHANGELOG_MDX), { recursive: true });
  await fs.writeFile(
    CHANGELOG_MDX,
    `---
title: Changelog
description: What has changed in each version of the code packages, the Figma file and the documentation.
latestVersion: ${latestVersion}
---

${content}`,
    'utf8',
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
