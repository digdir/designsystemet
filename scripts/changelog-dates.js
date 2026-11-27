/**
 * The release dates of the versions in changelog.json: the day the GitHub release of a version was
 * published (in UTC). This is the one place they come from, for both scripts that add them:
 * - scripts/group-changelogs.js, when the release pull request is prepared. The version being
 *   prepared has no release yet, so it is left undated.
 * - scripts/date-latest-changelog.js, in the www deploy, when that release exists.
 *
 * Only imports from Node itself, since the www deploy runs without installing packages.
 * Needs `gh`, and in a workflow a GH_TOKEN that can read the releases. Without them no dates are
 * added.
 */
import { execFileSync } from 'node:child_process';

/** @type {Map<string, string> | undefined} tag → `YYYY-MM-DD`, read once */
let published;

function publishedDates() {
  if (published) return published;
  published = new Map();
  try {
    const releases = JSON.parse(
      execFileSync(
        'gh',
        ['release', 'list', '--limit', '1000', '--json', 'tagName,publishedAt'],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
      ),
    );
    for (const { tagName, publishedAt } of releases) {
      // A draft is not published
      if (publishedAt) published.set(tagName, publishedAt.slice(0, 10));
    }
  } catch {
    // No `gh` or no access: the versions are left undated
  }
  return published;
}

/**
 * The release date of a version as `YYYY-MM-DD`, from its aggregated `v<version>` release, or for
 * the versions before those (up to 1.0.3), from the release of the CLI package.
 * @param {string} version
 * @returns {string | undefined}
 */
export const getReleaseDate = (version) =>
  publishedDates().get(`v${version}`) ??
  publishedDates().get(`@digdir/designsystemet@${version}`);

/**
 * Adds the release date to the versions that have none. The others are returned as they are.
 * @template {{ version: string, date?: string }} T
 * @param {T[]} releases
 * @returns {T[]}
 */
export function addReleaseDates(releases) {
  return releases.map((release) => {
    const date = release.date ?? getReleaseDate(release.version);
    if (!date || release.date) return release;
    // After the version in changelog.json
    const { version, ...rest } = release;
    return { version, date, ...rest };
  });
}
