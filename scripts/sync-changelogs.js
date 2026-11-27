/**
 * Builds the changelog pages for www from changelog.json, where each change is listed once
 * with the packages it affects: one page for the code packages, and one for the Figma packages
 * (the UI kit and the plugin). Each page shows the changes that affect at least one of its
 * packages. changelog.json is built by scripts/group-changelogs.js; this file only
 * formats it as MDX and writes it.
 */
import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { releaseDateMarkup } from './changelog-date.js';
import {
  CHANGE_HEADINGS,
  CHANGE_TYPES,
  changeList,
  NO_CHANGES,
  readChangelog,
  toMarkdown,
} from './group-changelogs.js';

const ROOT = process.cwd();
const WWW = path.join(ROOT, 'apps/www/app/content/components-docs');
const WWW_FIGMA = path.join(ROOT, 'apps/www/app/content/fundamentals');

// The packages each page shows changes for
const CODE_PACKAGES = [
  '@digdir/designsystemet',
  '@digdir/designsystemet-css',
  '@digdir/designsystemet-react',
  '@digdir/designsystemet-web',
  '@digdir/designsystemet-types',
];
const FIGMA_PACKAGES = ['figma-plugin', 'figma-ui-kit'];

// Short names for the packages, shown as tags under each change on www
const LABELS = {
  '@digdir/designsystemet': 'CLI',
  '@digdir/designsystemet-css': 'CSS',
  '@digdir/designsystemet-react': 'React',
  '@digdir/designsystemet-web': 'Web',
  '@digdir/designsystemet-types': 'Types',
  'figma-plugin': 'Figma plugin',
  'figma-ui-kit': 'Figma UI kit',
  '@web/www': 'Documentation',
};

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
 * @param {import('./group-changelogs.js').Change[]} changes the changes to show
 * @param {string | null} date the release date as `YYYY-MM-DD`, or null to leave the version undated
 */
function formatVersion(version, changes, date) {
  let out = `<div style={{
  border: "1px solid var(--ds-color-neutral-border-subtle)",
  borderRadius: "var(--ds-border-radius-md)",
  padding: "var(--ds-size-5)",
  marginBottom: "var(--ds-size-4)"
  }}
>\n\n## ${version}\n\n`;
  if (date) out += `${releaseDateMarkup(date)}\n\n`;

  if (changes.length === 0) out += `${NO_CHANGES}\n\n`;
  for (const type of CHANGE_TYPES) {
    const entries = changes.filter((change) => change.type === type);
    if (entries.length === 0) continue;
    out += `### ${CHANGE_HEADINGS[type]}\n\n`;
    const list = changeList(entries, ({ packages }) => [
      {
        type: 'html',
        // Styled by `[data-packages]` in apps/www/app/routes/components/component.module.css
        value: `<div data-packages>${packages
          .map((name) => `<Tag>${LABELS[name] ?? name}</Tag>`)
          .join('')}</div>`,
      },
    ]);
    out += `${toMarkdown([list])}\n\n`;
  }

  return `${out}</div>\n\n`;
}

/**
 * The versions in changelog.json, newest first, with only the changes that affect at least one of
 * `packages`.
 * @param {string[]} packages package names
 */
async function readChanges(packages) {
  const { releases } = await readChangelog();
  return releases.map((release) => ({
    ...release,
    changes: release.changes.filter((change) =>
      change.packages.some((name) => packages.includes(name)),
    ),
  }));
}

async function writeComponentsChangelog() {
  await fs.mkdir(WWW, { recursive: true });
  const releases = await readChanges(CODE_PACKAGES);

  let consolidatedContent = '';
  for (const { version, changes } of releases) {
    consolidatedContent += formatVersion(
      version,
      changes,
      getReleaseDate(version),
    );
  }

  const latestVersion = releases[0]?.version;

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

async function writeFigmaChangelog() {
  let consolidatedContent = '';
  for (const { version, changes, figmaPublished } of await readChanges(
    FIGMA_PACKAGES,
  )) {
    // The Figma file is published by hand, not with the code, so its versions have no tags to date
    // them by. The date is written in its changelog instead; see figma/README.md.
    const date = figmaPublished ?? null;
    // The Figma packages are versioned with the code by changesets, so most code releases add a
    // version without changes to them. Only versions with changes, or that were published, are shown.
    if (changes.length === 0 && !date) continue;
    consolidatedContent += formatVersion(version, changes, date);
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
