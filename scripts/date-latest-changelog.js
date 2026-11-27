/**
 * Dates the versions in changelog.json that have no release date, from their GitHub releases.
 *
 * scripts/group-changelogs.js runs while the release pull request is being prepared, when the
 * newest version has no release yet, so it leaves that version undated. This script runs in the
 * www deploy right before the image is built, when the release exists, and adds the date. It
 * does nothing when every version is dated or when the release does not exist yet (e.g. a
 * preview deploy of an open release pull request).
 *
 * The dates come from scripts/changelog-dates.js, as in scripts/group-changelogs.js. The deploy
 * runs this without installing packages, so both files only import from Node itself.
 *
 * Usage: node scripts/date-latest-changelog.js
 * Needs `gh` and a GH_TOKEN with read access to the repository's releases.
 */
import { promises as fs } from 'node:fs';
import { addReleaseDates } from './changelog-dates.js';

// The same file as CHANGELOG_JSON in scripts/group-changelogs.js
const file = 'changelog.json';

async function main() {
  /** @type {import('./group-changelogs.js').Changelog} */
  const changelog = JSON.parse(await fs.readFile(file, 'utf8'));
  // Fails when the releases can't be read, so a deploy does not show a version without its date
  const releases = addReleaseDates(changelog.releases, { required: true });
  const dated = releases.filter(
    (release, i) => release !== changelog.releases[i],
  );
  if (dated.length === 0) {
    console.log('No versions to date.');
    return;
  }

  await fs.writeFile(
    file,
    `${JSON.stringify({ ...changelog, releases }, null, 2)}\n`,
    'utf8',
  );
  for (const { version, date } of dated)
    console.log(`Dated ${version} as ${date}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
