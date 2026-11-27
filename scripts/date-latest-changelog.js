/**
 * Dates the newest version in changelog.json from its GitHub release.
 *
 * scripts/group-changelogs.js runs while the release pull request is being prepared, when the
 * newest version has no tag or release yet, so it leaves that version undated. This script runs
 * in the www deploy right before the image is built, when the `v<version>` release exists, and
 * adds the date. It is idempotent and a no-op when the version is already dated or when no
 * release exists yet (e.g. a preview deploy of an open release pull request).
 *
 * The deploy runs it without installing packages, so it only imports from Node itself. That is
 * also why it does not use the helpers in scripts/group-changelogs.js, which imports remark.
 *
 * Usage: node scripts/date-latest-changelog.js
 * Needs `gh` and a GH_TOKEN with read access to the repository's releases.
 */
import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';

// The same file as CHANGELOG_JSON in scripts/group-changelogs.js
const file = 'changelog.json';

/** The date the `v<version>` GitHub release was published, as `YYYY-MM-DD`, or '' */
function getReleaseDate(version) {
  try {
    return execFileSync(
      'gh',
      [
        'release',
        'view',
        `v${version}`,
        '--json',
        'publishedAt',
        '--jq',
        '.publishedAt[:10]',
      ],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim();
  } catch {
    return '';
  }
}

async function main() {
  /** @type {import('./group-changelogs.js').Changelog} */
  const changelog = JSON.parse(await fs.readFile(file, 'utf8'));
  const [latest] = changelog.releases;
  if (latest.date) {
    console.log(`${latest.version} is already dated.`);
    return;
  }

  const date = getReleaseDate(latest.version);
  if (!date) {
    console.log(
      `No GitHub release v${latest.version} found; leaving ${latest.version} undated.`,
    );
    return;
  }

  // After the version, as group-changelogs.js writes it
  const { version, ...rest } = latest;
  changelog.releases[0] = { version, date, ...rest };
  await fs.writeFile(file, `${JSON.stringify(changelog, null, 2)}\n`, 'utf8');
  console.log(`Dated ${version} as ${date}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
