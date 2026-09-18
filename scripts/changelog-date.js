/**
 * The release-date line rendered under each `## <version>` heading in the www changelog.
 * Shared by scripts/sync-changelogs.js (versions that are already released) and
 * scripts/date-latest-changelog.js (the newest version, dated at deploy time).
 */

const dateFormatter = new Intl.DateTimeFormat('nb-NO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/** Matches the markup below, so a version can be checked for an existing date. */
export const RELEASE_DATE_PATTERN = /<time dateTime="(\d{4}-\d{2}-\d{2})">/;

/** @param {string} date `YYYY-MM-DD` */
export function releaseDateMarkup(date) {
  return `<Paragraph data-size="sm" style={{ color: "var(--ds-color-neutral-text-subtle)" }}>
  <time dateTime="${date}">${dateFormatter.format(new Date(date))}</time>
</Paragraph>`;
}
