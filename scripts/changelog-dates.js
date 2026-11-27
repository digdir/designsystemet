/**
 * The release dates of the versions in changelog.json: the day the GitHub release of a version was
 * published, in Norway. This is the one place they come from, for both scripts that add them:
 * - scripts/group-changelogs.js, when the release pull request is prepared. The version being
 *   prepared has no release yet, so it is left undated.
 * - scripts/date-changelog.js, in the www deploy, when that release exists.
 *
 * Only imports from Node itself, since the www deploy runs without installing packages.
 * Needs `gh`, and in a workflow a GH_TOKEN that can read the releases.
 */
import { execFileSync } from 'node:child_process';

/**
 * A time as the day it is in Norway, as `YYYY-MM-DD`. The Swedish locale is a trick to get that
 * format: Swedish dates are written that way, Norwegian ones as `20.11.2026`. The time zone is
 * what makes it the day in Norway.
 */
const osloDay = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Oslo' });

/** @type {Map<string, string> | undefined} tag → `YYYY-MM-DD`, read once */
let published;

/**
 * Throws when the releases can't be read, e.g. without `gh` or a token. That is not the same as
 * a version without a release, which is left undated.
 */
function publishedDates() {
  if (published) return published;
  let releases;
  try {
    releases = JSON.parse(
      execFileSync(
        'gh',
        ['release', 'list', '--limit', '1000', '--json', 'tagName,publishedAt'],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
      ),
    );
  } catch (error) {
    throw new Error(
      `Could not read the GitHub releases with gh, so the versions can't be dated: ${error.stderr?.trim() || error.message}`,
    );
  }
  published = new Map();
  for (const { tagName, publishedAt } of releases) {
    // A draft is not published
    if (publishedAt)
      published.set(tagName, osloDay.format(new Date(publishedAt)));
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
 *
 * When the releases can't be read, it fails if `required`, and else warns and leaves the versions
 * undated, to be dated on a later run.
 * @template {{ version: string, date?: string }} T
 * @param {T[]} releases
 * @param {{ required?: boolean }} [options]
 * @returns {T[]}
 */
export function addReleaseDates(releases, { required = false } = {}) {
  try {
    return releases.map((release) => {
      const date = release.date ?? getReleaseDate(release.version);
      if (!date || release.date) return release;
      // After the version in changelog.json
      const { version, ...rest } = release;
      return { version, date, ...rest };
    });
  } catch (error) {
    if (required) throw error;
    console.warn(`Warning: ${error.message}`);
    return releases;
  }
}
