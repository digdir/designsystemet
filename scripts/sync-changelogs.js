/**
 * Builds the consolidated changelog for www from the CHANGELOG.md of every
 * package. Aggregation lives in scripts/aggregate-changelogs.js; this file
 * only formats the result as MDX and writes it.
 */
import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { aggregateChangelogs, findPackages } from './aggregate-changelogs.js';
import { releaseDateMarkup } from './changelog-date.js';

const ROOT = process.cwd();
const WWW = path.join(ROOT, 'apps/www/app/content/components-docs');

// Stop at "## 0.101.0" - this is the first entry before version 1
const CUTOFF_VERSION = '0.101.0';

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

function formatVersion(version, packages) {
  const date = getReleaseDate(version);
  let out = `<div style={{
  border: "1px solid var(--ds-color-neutral-border-subtle)",
  borderRadius: "var(--ds-border-radius-md)",
  padding: "var(--ds-size-5)",
  marginBottom: "var(--ds-size-4)"
  }}
>\n\n## ${version}\n\n`;
  if (date) out += `${releaseDateMarkup(date)}\n\n`;

  for (const [pkgName, body] of packages) {
    if (!body) continue;
    // Adjust heading levels: ### (h3) -> #### (h4)
    const content = body.replace(/^###\s+/gm, '#### ');
    out += `<Divider/>\n\n### ${pkgName}\n\n${content}\n\n`;
  }

  return `${out}</div>\n\n`;
}

async function main() {
  await fs.mkdir(WWW, { recursive: true });
  const pkgs = [...(await findPackages()).values()];
  const allVersions = await aggregateChangelogs(pkgs, {
    until: CUTOFF_VERSION,
  });

  let consolidatedContent = '';
  for (const [version, packages] of allVersions) {
    consolidatedContent += formatVersion(version, packages);
  }

  const latestVersion = pkgs[0]?.version;

  const content = `---
title: "Changelog"
latestVersion: ${latestVersion}
---

${consolidatedContent}`;

  await fs.writeFile(path.join(WWW, 'changelog.mdx'), content, 'utf8');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
