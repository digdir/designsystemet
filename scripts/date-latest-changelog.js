/**
 * Dates the newest version in changelog.json from its GitHub release.
 *
 * scripts/group-changelogs.js runs while the release pull request is being prepared, when the
 * newest version has no tag or release yet, so it leaves that version undated. This script runs
 * in the www deploy right before the image is built, when the `v<version>` release exists, and
 * adds the date. It is idempotent and a no-op when the version is already dated or when no
 * release exists yet (e.g. a preview deploy of an open release pull request).
 *
 * Usage: node scripts/date-latest-changelog.js [path/to/changelog.json]
 * Needs `gh` and a GH_TOKEN with read access to the repository's releases.
 */
import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { CHANGELOG_JSON, readChangelog } from './group-changelogs.js';

const file = path.resolve(process.argv[2] ?? CHANGELOG_JSON);

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
  const changelog = await readChangelog(file);
  const [latest] = changelog.releases;
  if (!latest) {
    console.log('No versions in changelog.json; nothing to date.');
    return;
  }
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
