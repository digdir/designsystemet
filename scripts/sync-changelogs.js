/**
 * Builds the consolidated changelogs for www from the CHANGELOG.md of every
 * package: one for the code packages, and one for the Figma packages (the
 * design file, and later the plugin). Aggregation lives in
 * scripts/aggregate-changelogs.js; this file only formats the result as MDX
 * and writes it.
 */
import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { aggregateChangelogs, findPackages } from './aggregate-changelogs.js';
import { releaseDateMarkup } from './changelog-date.js';

const ROOT = process.cwd();
const WWW = path.join(ROOT, 'apps/www/app/content/components-docs');
const WWW_FIGMA = path.join(ROOT, 'apps/www/app/content/fundamentals');

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

/**
 * @param {string} version
 * @param {Map<string, string>} packages package name → changelog body
 * @param {string | null} date the release date as `YYYY-MM-DD`, or null to leave the version undated
 */
function formatVersion(version, packages, date) {
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

async function writeComponentsChangelog() {
  await fs.mkdir(WWW, { recursive: true });
  const pkgs = [...(await findPackages()).values()];
  const allVersions = await aggregateChangelogs(pkgs, {
    until: CUTOFF_VERSION,
  });

  let consolidatedContent = '';
  for (const [version, packages] of allVersions) {
    consolidatedContent += formatVersion(
      version,
      packages,
      getReleaseDate(version),
    );
  }

  const latestVersion = pkgs[0]?.version;

  const content = `---
title: "Changelog"
latestVersion: ${latestVersion}
---

${consolidatedContent}`;

  await fs.writeFile(path.join(WWW, 'changelog.mdx'), content, 'utf8');
}

// Shown in the Figma section of Fundamentals, next to "Get updates". The changelogs are only in English.
const FIGMA_PAGES = {
  en: {
    frontmatter: {
      title: 'Figma changelog',
      sidebar_title: 'Changelog',
      description:
        'What has changed in each version of the Designsystemet Figma file.',
    },
    intro: '',
  },
  no: {
    frontmatter: {
      title: 'Endringslogg for Figma',
      sidebar_title: 'Endringslogg',
      description:
        'Hva som er endret i hver versjon av Figma-filen til Designsystemet.',
    },
    intro:
      "<Alert lang='no'>Endringslogger er kun tilgjengelige på engelsk</Alert>\n\n",
  },
};

// The Figma file is published by hand, not with the code, so its versions have no tags to date them
// by. Instead, the date is written in the changelog as a `_Published YYYY-MM-DD_` line under the
// version heading; see figma/design-file/README.md.
const PUBLISHED_DATE = /^_Published (\d{4}-\d{2}-\d{2})_\s*$\n*/m;
// What a package's changelog says for a version that only bumped it with the others.
const NO_CHANGES = 'No changes in this release.';

async function writeFigmaChangelog() {
  const pkgs = [...(await findPackages(['figma'])).values()];
  const allVersions = await aggregateChangelogs(pkgs);

  let consolidatedContent = '';
  for (const [version, packages] of allVersions) {
    let date = null;
    const bodies = new Map();
    for (const [name, body] of packages) {
      date ??= PUBLISHED_DATE.exec(body)?.[1] ?? null;
      const content = body.replace(PUBLISHED_DATE, '').trim();
      if (content && content !== NO_CHANGES) bodies.set(name, content);
    }
    // The Figma packages are versioned with the code by changesets, so most code releases add a
    // version without changes to them. Only versions with changes, or that were published, are shown.
    if (bodies.size === 0 && !date) continue;
    consolidatedContent += formatVersion(version, bodies, date);
  }

  for (const [lang, { frontmatter, intro }] of Object.entries(FIGMA_PAGES)) {
    const dir = path.join(WWW_FIGMA, lang, 'figma');
    await fs.mkdir(dir, { recursive: true });
    const content = `---
title: ${frontmatter.title}
sidebar_title: ${frontmatter.sidebar_title}
description: ${frontmatter.description}
category: Figma
color: yellow
icon: ClockDashedIcon
published: true
order: 50
search_terms: changelog
changelog: true
---

${intro}<div lang="en">

${consolidatedContent}</div>
`;
    await fs.writeFile(path.join(dir, 'changelog.mdx'), content, 'utf8');
  }
}

async function main() {
  await writeComponentsChangelog();
  await writeFigmaChangelog();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
