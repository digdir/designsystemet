/**
 * Dates the newest version in the www changelog from its GitHub release.
 *
 * scripts/sync-changelogs.js runs while the release pull request is being prepared, when the
 * newest version has no tag or release yet, so it leaves that version undated. This script runs
 * in the www deploy right before the image is built, when the `v<version>` release exists, and
 * inserts the date. It is idempotent and a no-op when the version is already dated or when no
 * release exists yet (e.g. a preview deploy of an open release pull request).
 *
 * Usage: node scripts/date-latest-changelog.js [path/to/changelog.mdx]
 * Needs `gh` and a GH_TOKEN with read access to the repository's releases.
 */
import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { RELEASE_DATE_PATTERN, releaseDateMarkup } from './changelog-date.js';

const file = path.resolve(
  process.argv[2] ?? 'apps/www/app/content/components-docs/changelog.mdx',
);

function getReleaseDate(version) {
  try {
    const publishedAt = execFileSync(
      'gh',
      [
        'release',
        'view',
        `v${version}`,
        '--json',
        'publishedAt',
        '--jq',
        '.publishedAt',
      ],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim();
    return publishedAt ? publishedAt.slice(0, 10) : null;
  } catch {
    return null;
  }
}

async function main() {
  const content = await fs.readFile(file, 'utf8');
  const version = /^latestVersion:\s*(\S+)/m.exec(content)?.[1];
  if (!version) {
    console.log('No latestVersion in frontmatter; nothing to date.');
    return;
  }

  const heading = `## ${version}\n`;
  const start = content.indexOf(heading);
  if (start === -1) {
    console.log(`No "## ${version}" section found; nothing to date.`);
    return;
  }
  const sectionEnd = content.indexOf('\n## ', start + heading.length);
  const section = content.slice(
    start,
    sectionEnd === -1 ? undefined : sectionEnd,
  );
  if (RELEASE_DATE_PATTERN.test(section)) {
    console.log(`${version} is already dated.`);
    return;
  }

  const date = getReleaseDate(version);
  if (!date) {
    console.log(
      `No GitHub release v${version} found; leaving ${version} undated.`,
    );
    return;
  }

  const insertAt = start + heading.length;
  const updated = `${content.slice(0, insertAt)}\n${releaseDateMarkup(date)}\n${content.slice(insertAt)}`;
  await fs.writeFile(file, updated, 'utf8');
  console.log(`Dated ${version} as ${date}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
