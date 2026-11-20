/**
 * Builds the changelog page for www from the root CHANGELOG.md, where each change is listed once
 * with the packages it affects. The page lists every package, and can be filtered by package, see
 * apps/www/app/routes/changelog/changelog.tsx. The root CHANGELOG.md is built by
 * scripts/group-changelogs.js; this file only formats it as MDX and writes it.
 *
 * The MDX uses these components, so the page can filter and style the changes:
 *
 *   <Release version="1.24.1" date="2026-11-18" figmaPublished="2026-11-19" packages="cli,css">
 *     <Changes type="patch" packages="cli,css">
 *       <Change packages="cli,css"> markdown </Change>
 *     </Changes>
 *   </Release>
 */
import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { aggregateChangelogs, findPackages } from './aggregate-changelogs.js';
import {
  BUMPS,
  CHANGELOG_FILE,
  parseGroupedChangelog,
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

/** The ids of the packages, in a fixed order and without duplicates, e.g. `cli,css` */
const packageIds = (names) =>
  [...new Set(names.map((name) => PACKAGE_IDS[name] ?? name))]
    .sort((a, b) => PACKAGE_ORDER.indexOf(a) - PACKAGE_ORDER.indexOf(b))
    .join(',');

const BUMP_TYPES = {
  'Major Changes': 'major',
  'Minor Changes': 'minor',
  'Patch Changes': 'patch',
};

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
 * in release.yml.
 */
function getReleaseDate(version) {
  const fromTag = git(['log', '-1', '--format=%cs', `refs/tags/v${version}`]);
  if (fromTag) return fromTag;

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

/**
 * The text of an entry without its list marker, and its other lines without the indentation that
 * kept them in the list item, so they are read as markdown of their own.
 */
const unlist = (text) =>
  text
    .replace(/^- /, '')
    .split('\n')
    .map((line) => line.replace(/^ {2}/, ''))
    .join('\n');

/** @param {{ text: string, packages: string[] }} change */
const formatChange = ({ text, packages }) =>
  `<Change packages="${packageIds(packages)}">\n\n${unlist(text)}\n\n</Change>\n\n`;

/**
 * @param {string} version
 * @param {{ bump: string, text: string, packages: string[] }[]} changes
 * @param {{ date: string | null, figmaPublished: string | undefined }} dates as `YYYY-MM-DD`. A
 * version without a date is dated at deploy time, see scripts/date-latest-changelog.js.
 */
function formatRelease(version, changes, { date, figmaPublished }) {
  const attributes = [`version="${version}"`];
  if (date) attributes.push(`date="${date}"`);
  if (figmaPublished) attributes.push(`figmaPublished="${figmaPublished}"`);
  attributes.push(
    `packages="${packageIds(changes.flatMap((change) => change.packages))}"`,
  );

  let out = `<Release ${attributes.join(' ')}>\n\n`;
  for (const bump of BUMPS) {
    const entries = changes.filter((change) => change.bump === bump);
    if (entries.length === 0) continue;
    const packages = packageIds(entries.flatMap((entry) => entry.packages));
    out += `<Changes type="${BUMP_TYPES[bump]}" packages="${packages}">\n\n${entries.map(formatChange).join('')}</Changes>\n\n`;
  }
  return `${out}</Release>\n\n`;
}

// The Figma file is published by hand, not with the code, so its versions have no tags to date them
// by. Instead, the date is written in the changelog as a `_Published YYYY-MM-DD_` line under the
// version heading; see figma/README.md.
const PUBLISHED_DATE = /^_Published (\d{4}-\d{2}-\d{2})_\s*$/m;

/** The dates the Figma file was published, by version. */
async function figmaPublishedDates() {
  const pkgs = [...(await findPackages(['figma'])).values()];
  const dates = new Map();
  for (const [version, packages] of await aggregateChangelogs(pkgs)) {
    for (const body of packages.values()) {
      const date = PUBLISHED_DATE.exec(body)?.[1];
      if (date && !dates.has(version)) dates.set(version, date);
    }
  }
  return dates;
}

async function main() {
  const versions = parseGroupedChangelog(
    await fs.readFile(CHANGELOG_FILE, 'utf8'),
  );
  const published = await figmaPublishedDates();

  let releases = '';
  for (const [version, changes] of versions) {
    releases += formatRelease(version, changes, {
      date: getReleaseDate(version),
      figmaPublished: published.get(version),
    });
  }

  const latestVersion = [...versions.keys()][0];
  const content = `---
title: Changelog
description: What has changed in each version of the code packages, the Figma file and the documentation.
latestVersion: ${latestVersion}
---

${releases}`;

  await fs.mkdir(path.dirname(CHANGELOG_MDX), { recursive: true });
  await fs.writeFile(CHANGELOG_MDX, content, 'utf8');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
