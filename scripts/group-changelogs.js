/**
 * Builds the root CHANGELOG.md: one section per version for all packages together, where each change is
 * listed once with the packages it affects underneath, instead of once per package.
 *
 * A changeset that lists several packages writes the same text into each package's CHANGELOG.md.
 * Those entries are merged here. The package changelogs themselves are left as they are, since
 * they are published with each package.
 *
 * Usage:
 *   node scripts/group-changelogs.js                     adds the versions that are missing from CHANGELOG.md
 *   node scripts/group-changelogs.js --all               rebuilds every version
 *   node scripts/group-changelogs.js --release <version> prints the section of a version, for its
 *                                                        GitHub release (see create-aggregated-release.sh)
 *
 * Versions already in CHANGELOG.md are kept as they are, so they can be edited by hand, e.g. to
 * merge two entries that describe the same change for different readers.
 *
 * The exported helpers are also used by scripts/sync-changelogs.js to build the changelog pages
 * for www from CHANGELOG.md.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  findPackages,
  NO_CHANGES,
  parseChangelog,
} from './aggregate-changelogs.js';

const ROOT = process.cwd();
export const CHANGELOG_FILE = path.join(ROOT, 'CHANGELOG.md');

// Stop at "## 0.101.0" - this is the first entry before version 1
const CUTOFF_VERSION = '0.101.0';

/** The order packages are listed in under each change. Other packages come last. */
const PACKAGE_ORDER = [
  '@digdir/designsystemet',
  '@digdir/designsystemet-css',
  '@digdir/designsystemet-react',
  '@digdir/designsystemet-web',
  '@digdir/designsystemet-types',
  'figma-plugin',
  'figma-ui-kit',
  '@web/www',
];
const packageOrder = (name) => {
  const index = PACKAGE_ORDER.indexOf(name);
  return index === -1 ? Number.POSITIVE_INFINITY : index;
};

/** The line under each change that lists the packages it affects, e.g. `` _`figma-plugin` · `figma-ui-kit`_ `` */
const formatPackages = (packages) =>
  `_${packages.map((name) => `\`${name}\``).join(' · ')}_`;
const PACKAGES_LINE = /^\s*_(`[^`]+`(?: · `[^`]+`)*)_\s*$/;

export const BUMPS = ['Major Changes', 'Minor Changes', 'Patch Changes'];

const HEADER = `# designsystemet changelog

<!--
  Built by scripts/group-changelogs.js from the CHANGELOG.md of every package, when versioning.
  Each change is listed once, with the packages it affects in the line under it.
  Versions already here are not rebuilt, so they can be edited by hand.
  The changelog pages on www are built from this file by scripts/sync-changelogs.js.
-->
`;

/** Trims trailing whitespace per line and blank lines around the text, so identical entries compare equal. */
const tidy = (text) =>
  text
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();

/**
 * Splits a version body from a package changelog into its list items.
 * @param {string} body
 * @returns {{ bump: string, text: string }[]}
 */
function parseItems(body) {
  const items = [];
  let bump = 'Patch Changes';
  let current = null;
  const flush = () => {
    if (current) items.push({ bump, text: tidy(current.join('\n')) });
    current = null;
  };
  for (const line of body.split('\n')) {
    // A pre-release heading, e.g. `## 1.0.0-next.14`, ends the stable version
    if (line.startsWith('## ')) break;
    const heading = /^###\s+(.+?)\s*$/.exec(line);
    if (heading) {
      flush();
      bump = heading[1];
      continue;
    }
    if (line.startsWith('- ')) {
      flush();
      current = [line];
    } else if (current) {
      current.push(line);
    }
  }
  flush();
  return items;
}

// The packages are versioned together, so these only say that the others were bumped as well
const isDependencyBump = (text) => text.startsWith('- Updated dependencies');

// Renovate's grouped updates, written in a few ways over time, e.g. "Update npm non-major
// dependencies" or "fix(deps): update npm non-major dependencies". They say nothing more
// than their links, so each version lists them as one entry.
const DEPENDENCY_UPDATES =
  /^- (?:fix\(deps\): )?updated? (?:npm )?non-major dependencie?s?\b/i;
const DEPENDENCY_UPDATES_TEXT = 'Update npm non-major dependencies';
// Links to pull requests, e.g. [#5613](…), or to commits, e.g. [`cc33a61`](…)
const CHANGE_LINK = /\[(?:#\d+|`[0-9a-f]+`)\]\([^)]+\)/g;

/**
 * Merges the dependency updates of a version into one entry, with the links of all of them.
 * @param {Map<string, { bump: string, packages: string[] }>} changes entry text → change
 */
function mergeDependencyUpdates(changes) {
  const updates = [...changes].filter(([text]) =>
    DEPENDENCY_UPDATES.test(text),
  );
  if (updates.length === 0) return changes;

  const links = new Set();
  const packages = new Set();
  let bump = updates[0][1].bump;
  for (const [text, change] of updates) {
    for (const [link] of text.matchAll(CHANGE_LINK)) links.add(link);
    for (const name of change.packages) packages.add(name);
    if (BUMPS.indexOf(change.bump) < BUMPS.indexOf(bump)) bump = change.bump;
  }
  const merged = {
    bump,
    packages: [...packages].sort((a, b) => packageOrder(a) - packageOrder(b)),
  };
  // Pull requests in number order, then commits
  const linkOrder = (link) => Number(/\[#(\d+)\]/.exec(link)?.[1] ?? Infinity);
  const sortedLinks = [...links].sort((x, y) => linkOrder(x) - linkOrder(y));
  const text = `- ${DEPENDENCY_UPDATES_TEXT} (${sortedLinks.join(', ')})`;

  // In the place of the first of them
  const result = new Map();
  for (const [entry, change] of changes) {
    if (!DEPENDENCY_UPDATES.test(entry)) result.set(entry, change);
    else if (!result.has(text)) result.set(text, merged);
  }
  return result;
}

/**
 * Merges the package changelogs into one list of changes per version.
 * @param {Iterable<{ name: string, dir: string }>} pkgs
 * @returns {Promise<Map<string, Map<string, { bump: string, packages: string[] }>>>} version → (entry text → change), newest first
 */
export async function groupChangelogs(pkgs) {
  const versions = new Map();
  const sorted = [...pkgs].sort(
    (a, b) => packageOrder(a.name) - packageOrder(b.name),
  );
  for (const pkg of sorted) {
    let md;
    try {
      md = await fs.readFile(path.join(pkg.dir, 'CHANGELOG.md'), 'utf8');
    } catch {
      continue;
    }
    for (const [version, body] of parseChangelog(md, {
      until: CUTOFF_VERSION,
    })) {
      if (!versions.has(version)) versions.set(version, new Map());
      if (body === NO_CHANGES) continue;
      const changes = versions.get(version);
      for (const { bump, text } of parseItems(body)) {
        if (isDependencyBump(text)) continue;
        const change = changes.get(text) ?? { bump, packages: [] };
        // A change is listed under the biggest bump any of its packages got
        if (BUMPS.indexOf(bump) < BUMPS.indexOf(change.bump))
          change.bump = bump;
        change.packages.push(pkg.name);
        changes.set(text, change);
      }
    }
  }
  return new Map(
    [...versions]
      .sort(([a], [b]) => compareVersions(b, a))
      .map(([version, changes]) => [version, mergeDependencyUpdates(changes)]),
  );
}

/** Compares two `x.y.z` versions numerically. */
export function compareVersions(a, b) {
  const [x, y] = [a, b].map((v) => v.split('.').map(Number));
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
}

/**
 * @param {string} version
 * @param {Map<string, { bump: string, packages: string[] }>} changes entry text → change
 */
export function formatVersion(version, changes) {
  const out = [`## designsystemet ${version}`];
  for (const bump of BUMPS) {
    const entries = [...changes].filter(([, change]) => change.bump === bump);
    if (entries.length === 0) continue;
    out.push(`### ${bump}`);
    for (const [text, { packages }] of entries) {
      out.push(`${text}\n\n  ${formatPackages(packages)}`);
    }
  }
  if (out.length === 1) out.push(NO_CHANGES);
  return out.join('\n\n');
}

/**
 * Parses the root CHANGELOG.md.
 * @param {string} md
 * @returns {Map<string, { bump: string, text: string, packages: string[] }[]>} version → changes, in file order
 */
export function parseGroupedChangelog(md) {
  const versions = new Map();
  const sections = md.split(/^## designsystemet (\d+\.\d+\.\d+)\s*$/m);
  // sections: [header, version, body, version, body, ...]
  for (let i = 1; i < sections.length; i += 2) {
    const changes = [];
    for (const { bump, text } of parseItems(sections[i + 1])) {
      const lines = text.split('\n');
      const packagesLine = PACKAGES_LINE.exec(lines.at(-1) ?? '');
      changes.push({
        bump,
        text: tidy(packagesLine ? lines.slice(0, -1).join('\n') : text),
        packages: packagesLine
          ? packagesLine[1].split(' · ').map((name) => name.slice(1, -1))
          : [],
      });
    }
    versions.set(sections[i], changes);
  }
  return versions;
}

/**
 * The section of a version in CHANGELOG.md, from its `## designsystemet <version>` heading to the
 * next version, or null if it is not there.
 * @param {string} md
 * @param {string} version
 */
export function extractRelease(md, version) {
  const heading = `## designsystemet ${version}`;
  const start = md.search(
    new RegExp(`^${heading.replaceAll('.', '\\.')}\\s*$`, 'm'),
  );
  if (start === -1) return null;
  const end = md.indexOf('\n## designsystemet ', start + heading.length);
  return md.slice(start, end === -1 ? undefined : end).trim();
}

async function main() {
  const release = process.argv.indexOf('--release');
  if (release !== -1) {
    const version = process.argv[release + 1]?.replace(/^v/, '');
    const section = version
      ? extractRelease(await fs.readFile(CHANGELOG_FILE, 'utf8'), version)
      : null;
    if (!section) {
      console.error(`No "## designsystemet ${version}" in CHANGELOG.md`);
      process.exit(1);
    }
    process.stdout.write(`${section}\n`);
    return;
  }

  const rebuild = process.argv.includes('--all');
  let existing = '';
  if (!rebuild) {
    try {
      existing = await fs.readFile(CHANGELOG_FILE, 'utf8');
    } catch {}
  }
  const known = new Set(parseGroupedChangelog(existing).keys());

  // Keep the sections that are already there as they are, with any edits made by hand
  const sections = new Map();
  for (const match of existing.matchAll(
    /^## designsystemet (\d+\.\d+\.\d+)\s*$[\s\S]*?(?=^## designsystemet |(?![\s\S]))/gm,
  )) {
    sections.set(match[1], match[0].trim());
  }

  const pkgs = (await findPackages(['packages', 'figma', 'apps'])).values();
  let added = 0;
  for (const [version, changes] of await groupChangelogs(pkgs)) {
    if (known.has(version)) continue;
    sections.set(version, formatVersion(version, changes));
    added++;
  }

  const body = [...sections]
    .sort(([a], [b]) => compareVersions(b, a))
    .map(([, section]) => section)
    .join('\n\n');
  await fs.writeFile(CHANGELOG_FILE, `${HEADER}\n${body}\n`, 'utf8');
  console.log(
    `CHANGELOG.md: ${added} version(s) added, ${sections.size} in total.`,
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
