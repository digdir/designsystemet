/**
 * Aggregates the CHANGELOG.md of every package into a single structure, and
 * (when run as a CLI) builds the body for an aggregated GitHub release,
 * mirroring the output of the old `createGithubReleases: aggregate` mode from
 * dotansimha/changesets-action.
 *
 * Usage:
 *   node scripts/aggregate-release-notes.js '<published-packages JSON>' > notes.md
 *
 * `published-packages` is the output of changesets/action:
 *   [{ "name": "@digdir/designsystemet-react", "version": "1.20.1" }, ...]
 *
 * The exported helpers are also used by scripts/sync-changelogs.js to build the
 * consolidated changelog for www.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const PACKAGE_DIRS = ['packages'];

/**
 * Finds every package under PACKAGE_DIRS.
 * @returns {Promise<Map<string, { name: string, dir: string, version: string }>>} keyed by package name
 */
export async function findPackages() {
  const byName = new Map();
  for (const base of PACKAGE_DIRS) {
    let entries = [];
    try {
      entries = await fs.readdir(path.join(ROOT, base));
    } catch {}
    for (const entry of entries) {
      const dir = path.join(ROOT, base, entry);
      try {
        const pkg = JSON.parse(
          await fs.readFile(path.join(dir, 'package.json'), 'utf8'),
        );
        if (pkg.name)
          byName.set(pkg.name, { name: pkg.name, dir, version: pkg.version });
      } catch {}
    }
  }
  return byName;
}

/**
 * Parses a CHANGELOG.md into its `## <version>` sections, in file order.
 * @param {string} changelog
 * @param {{ until?: string }} [options] stop before this version (exclusive) when given
 * @returns {Map<string, string>} version → markdown body (heading removed, trimmed)
 */
export function parseChangelog(changelog, { until } = {}) {
  const versions = new Map();
  const lines = changelog.split('\n');
  let current = null;
  let buffer = [];

  const flush = () => {
    if (current !== null) versions.set(current, buffer.join('\n').trim());
    buffer = [];
  };

  for (const line of lines) {
    const match = /^##\s+(\d+\.\d+\.\d+)\s*$/.exec(line);
    if (match) {
      flush();
      if (until && match[1] === until) return versions;
      current = match[1];
      continue;
    }
    if (current !== null) buffer.push(line);
  }
  flush();
  return versions;
}

/** Returns the markdown under the `## <version>` heading, or null if missing. */
export function extractVersionSection(changelog, version) {
  return parseChangelog(changelog).get(version) ?? null;
}

/**
 * Reads and parses the CHANGELOG.md of every given package and merges them.
 * @param {Iterable<{ name: string, dir: string }>} pkgs
 * @param {{ until?: string }} [options] passed on to parseChangelog
 * @returns {Promise<Map<string, Map<string, string>>>} version → (package name → body)
 */
export async function aggregateChangelogs(pkgs, options) {
  const allVersions = new Map();
  for (const pkg of pkgs) {
    let md;
    try {
      md = await fs.readFile(path.join(pkg.dir, 'CHANGELOG.md'), 'utf8');
    } catch {
      continue;
    }
    for (const [version, body] of parseChangelog(md, options)) {
      if (!allVersions.has(version)) allVersions.set(version, new Map());
      allVersions.get(version).set(pkg.name, body);
    }
  }
  return allVersions;
}

async function main() {
  const raw = process.argv[2] ?? '';
  let published = [];
  try {
    published = JSON.parse(raw || '[]');
  } catch {
    console.error('Could not parse published packages JSON:', raw);
    process.exit(1);
  }
  if (!Array.isArray(published) || published.length === 0) {
    console.error('No published packages given.');
    process.exit(1);
  }

  const pkgs = await findPackages();
  const sections = [];

  for (const { name, version } of [...published].sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const pkg = pkgs.get(name);
    let body = null;
    if (pkg) {
      try {
        body = extractVersionSection(
          await fs.readFile(path.join(pkg.dir, 'CHANGELOG.md'), 'utf8'),
          version,
        );
      } catch {}
    }
    if (body === null) {
      console.error(`Warning: no changelog entry found for ${name}@${version}`);
      body = '_No changelog entry found._';
    }
    sections.push(`## ${name}@${version}\n\n${body}`);
  }

  process.stdout.write(`${sections.join('\n\n')}\n`);
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
