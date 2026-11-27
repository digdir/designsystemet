/**
 * Dates the versions in changelog.json that have no release date, from their GitHub releases.
 *
 * scripts/group-changelogs.ts runs while the release pull request is being prepared, when the
 * newest version has no release yet, so it leaves that version undated. This script runs in the
 * www deploy right before the image is built, when the release exists, and adds the date. It
 * does nothing when every version is dated or when the release does not exist yet (e.g. a
 * preview deploy of an open release pull request).
 *
 * The dates come from scripts/changelog-dates.ts, as in scripts/group-changelogs.ts. The deploy
 * runs this without installing packages, so both files only import from Node itself. Node
 * strips their types.
 *
 * Usage: node scripts/date-changelog.ts (in the deploy, without installed packages), or with
 * `pnpm node` to use the version of Node in package.json
 *   --dry-run   only says what would be dated. Used in the Checks workflow to see that the script
 *               runs without installed packages. It does not fail when the releases can't be read.
 * Needs `gh` and a GH_TOKEN with read access to the repository's releases.
 */
import { promises as fs } from 'node:fs';
import { addReleaseDates } from './changelog-dates.ts';
import type { Changelog } from './changelog-types.ts';

// The same file as CHANGELOG_JSON in scripts/group-changelogs.ts
const file = 'changelog.json';

async function main() {
  const changelog: Changelog = JSON.parse(await fs.readFile(file, 'utf8'));
  const dryRun = process.argv.includes('--dry-run');
  let releases: Changelog['releases'];
  try {
    releases = addReleaseDates(changelog.releases, { required: true });
  } catch (error) {
    // Fails when the releases can't be read, so a deploy does not show a version without its
    // date. A dry run only says so.
    if (!dryRun) throw error;
    console.warn(`Warning: ${(error as Error).message}`);
    return;
  }
  const dated = releases.filter(
    (release, i) => release !== changelog.releases[i],
  );
  if (dated.length === 0) {
    console.log('No versions to date.');
    return;
  }

  if (!dryRun) {
    await fs.writeFile(
      file,
      `${JSON.stringify({ ...changelog, releases }, null, 2)}\n`,
      'utf8',
    );
  }
  for (const { version, date } of dated)
    console.log(`${dryRun ? 'Would date' : 'Dated'} ${version} as ${date}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
