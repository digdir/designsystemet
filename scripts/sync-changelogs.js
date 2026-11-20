/**
 * Builds the changelog pages for www from the root CHANGELOG.md, where each change is listed once
 * with the packages it affects: one page for the code packages, and one for the Figma packages
 * (the UI kit and the plugin). Each page shows the changes that affect at least one of its
 * packages. The root CHANGELOG.md is built by scripts/group-changelogs.js; this file only
 * formats it as MDX and writes it.
 */
import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  aggregateChangelogs,
  findPackages,
  NO_CHANGES,
} from './aggregate-changelogs.js';
import { releaseDateMarkup } from './changelog-date.js';
import {
  BUMPS,
  CHANGELOG_FILE,
  DEPENDENCY_UPDATES_TEXT,
  parseGroupedChangelog,
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

// Most entries start with the component or topic they are about in bold, e.g. `- **Dialog:** …`,
// or a few without the colon, e.g. `- **Search** Deprecated …`
const PREFIX =
  /^- \*\*(?:(?<name>[^*\n]+?)(?::\*\*|\*\*:)|(?<word>[^\s*`]+)\*\*(?= [A-Z]))\s*/;
const prefixName = (text) => {
  const groups = PREFIX.exec(text)?.groups;
  return groups?.name ?? groups?.word;
};
// The same name is written in several ways, e.g. `ToggleGroup`, `toggle-group` and `ds-toggle-group`
const prefixKey = (name) =>
  name
    .toLowerCase()
    .replace(/^ds-/, '')
    .replace(/[^a-z0-9,]/g, '');

/**
 * The name to show for each prefix: the spelling used most, preferring one that starts with a
 * capital letter, as the React components do.
 * @param {Map<string, { text: string }[]>} versions
 * @returns {Map<string, string>} prefix key → name
 */
function prefixLabels(versions) {
  const counts = new Map();
  for (const changes of versions.values()) {
    for (const { text } of changes) {
      const name = prefixName(text);
      if (!name) continue;
      const spellings = counts.get(prefixKey(name)) ?? new Map();
      spellings.set(name, (spellings.get(name) ?? 0) + 1);
      counts.set(prefixKey(name), spellings);
    }
  }
  const capitalized = (name) => (/^[A-Z]/.test(name) ? 1 : 0);
  return new Map(
    [...counts].map(([key, spellings]) => [
      key,
      [...spellings].sort(
        ([a, x], [b, y]) => capitalized(b) - capitalized(a) || y - x,
      )[0][0],
    ]),
  );
}

/** Indents every line of `text` by `spaces`, so it can be nested in a list item. */
const indent = (text, spaces) =>
  text
    .split('\n')
    .map((line) => (line ? ' '.repeat(spaces) + line : line))
    .join('\n');

/**
 * @param {{ text: string, packages: string[] }} change
 * @param {number} depth how deeply the entry is nested, 0 for the top level
 */
function formatEntry({ text, packages }, depth = 0) {
  const tags = packages
    .map((name) => `<Tag>${LABELS[name] ?? name}</Tag>`)
    .join('');
  // Styled by `[data-packages]` in apps/www/app/routes/components/component.module.css
  return indent(`${text}\n\n  <div data-packages>${tags}</div>\n\n`, depth * 2);
}

/**
 * The entries of one bump, grouped by their prefix: first the ones without a prefix, then one
 * group per component or topic in alphabetical order, then the dependency updates. A group with
 * several entries is shown as a nested list under its name.
 * @param {{ text: string, packages: string[] }[]} entries
 * @param {Map<string, string>} labels prefix key → name, see prefixLabels
 */
function formatEntries(entries, labels) {
  const general = [];
  const groups = new Map();
  const last = [];
  for (const entry of entries) {
    const name = prefixName(entry.text);
    if (entry.text.startsWith(`- ${DEPENDENCY_UPDATES_TEXT}`)) last.push(entry);
    else if (!name) general.push(entry);
    else {
      const label = labels.get(prefixKey(name)) ?? name;
      groups.set(label, [...(groups.get(label) ?? []), entry]);
    }
  }

  let out = general.map((entry) => formatEntry(entry)).join('');
  const sorted = [...groups].sort(([a], [b]) =>
    a.localeCompare(b, 'en', { sensitivity: 'base' }),
  );
  for (const [label, group] of sorted) {
    if (group.length === 1) {
      // Shown with the same spelling as in the groups
      const [entry] = group;
      out += formatEntry({
        ...entry,
        text: entry.text.replace(PREFIX, `- **${label}:** `),
      });
      continue;
    }
    out += `- **${label}**\n\n`;
    for (const entry of group) {
      out += formatEntry(
        { ...entry, text: entry.text.replace(PREFIX, '- ') },
        1,
      );
    }
  }
  return out + last.map((entry) => formatEntry(entry)).join('');
}

/**
 * @param {string} version
 * @param {{ bump: string, text: string, packages: string[] }[]} changes the changes to show
 * @param {string | null} date the release date as `YYYY-MM-DD`, or null to leave the version undated
 * @param {Map<string, string>} labels prefix key → name, see prefixLabels
 */
function formatVersion(version, changes, date, labels) {
  let out = `<div style={{
  border: "1px solid var(--ds-color-neutral-border-subtle)",
  borderRadius: "var(--ds-border-radius-md)",
  padding: "var(--ds-size-5)",
  marginBottom: "var(--ds-size-4)"
  }}
>\n\n## ${version}\n\n`;
  if (date) out += `${releaseDateMarkup(date)}\n\n`;

  if (changes.length === 0) out += `${NO_CHANGES}\n\n`;
  for (const bump of BUMPS) {
    const entries = changes.filter((change) => change.bump === bump);
    if (entries.length === 0) continue;
    out += `### ${bump}\n\n${formatEntries(entries, labels)}`;
  }

  return `${out}</div>\n\n`;
}

/**
 * The versions, newest first, with only the changes that affect at least one of `packages`.
 * @param {Map<string, { bump: string, text: string, packages: string[] }[]>} versions from the root CHANGELOG.md
 * @param {string[]} packages package names, as in the root CHANGELOG.md
 */
function filterChanges(versions, packages) {
  return new Map(
    [...versions].map(([version, changes]) => [
      version,
      changes.filter((change) =>
        change.packages.some((name) => packages.includes(name)),
      ),
    ]),
  );
}

/** @param {{ versions: Map<string, any[]>, labels: Map<string, string> }} changelog */
async function writeComponentsChangelog({ versions, labels }) {
  await fs.mkdir(WWW, { recursive: true });
  const pkgs = [...(await findPackages()).values()];

  let consolidatedContent = '';
  for (const [version, changes] of filterChanges(versions, CODE_PACKAGES)) {
    consolidatedContent += formatVersion(
      version,
      changes,
      getReleaseDate(version),
      labels,
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
// version heading; see figma/README.md.
const PUBLISHED_DATE = /^_Published (\d{4}-\d{2}-\d{2})_\s*$\n*/m;

/** @param {{ versions: Map<string, any[]>, labels: Map<string, string> }} changelog */
async function writeFigmaChangelog({ versions, labels }) {
  // The published dates are only in the Figma packages' own changelogs
  const pkgs = [...(await findPackages(['figma'])).values()];
  const publishedDates = new Map();
  for (const [version, packages] of await aggregateChangelogs(pkgs)) {
    for (const body of packages.values()) {
      const date = PUBLISHED_DATE.exec(body)?.[1];
      if (date && !publishedDates.has(version))
        publishedDates.set(version, date);
    }
  }

  let consolidatedContent = '';
  for (const [version, changes] of filterChanges(versions, FIGMA_PACKAGES)) {
    const date = publishedDates.get(version) ?? null;
    // The Figma packages are versioned with the code by changesets, so most code releases add a
    // version without changes to them. Only versions with changes, or that were published, are shown.
    if (changes.length === 0 && !date) continue;
    consolidatedContent += formatVersion(version, changes, date, labels);
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
  const versions = parseGroupedChangelog(
    await fs.readFile(CHANGELOG_FILE, 'utf8'),
  );
  // From every change, so a component has the same name on both pages and in every version
  const changelog = { versions, labels: prefixLabels(versions) };
  await writeComponentsChangelog(changelog);
  await writeFigmaChangelog(changelog);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
