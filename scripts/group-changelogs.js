/**
 * Builds changelog.json for www: one entry per version for all packages together, where each change
 * is listed once with the packages it affects, instead of once per package.
 *
 * A changeset that lists several packages writes the same text into each package's CHANGELOG.md.
 * Those entries are merged here. The package changelogs themselves are left as they are, since
 * they are published with each package. They are parsed with remark, so the changes are read as
 * list items, not lines.
 *
 * Usage:
 *   node scripts/group-changelogs.js                     adds the versions that are missing from changelog.json
 *   node scripts/group-changelogs.js --all               rebuilds every version
 *   node scripts/group-changelogs.js --release <version> prints the version as markdown, for its
 *                                                        GitHub release (see create-aggregated-release.sh)
 *                                                        and the release PR (see update-release-pr-body.sh)
 *     --file <path>                                      reads that changelog.json instead, e.g. from the
 *                                                        release PR's branch
 *
 * Versions already in changelog.json are kept as they are, so they can be edited by hand, e.g. to
 * merge two entries that describe the same change for different readers.
 *
 * The exported helpers are also used by scripts/sync-changelogs.js to build the changelog pages
 * for www from changelog.json.
 *
 * @typedef {'major' | 'minor' | 'patch'} ChangeType
 * @typedef {{ type: ChangeType, packages: string[], markdown: string, thanks?: string }} Change
 *   `packages` are package names, e.g. `@digdir/designsystemet-css`. `thanks` is the line the
 *   changeset generator writes before the change of a first-time contributor.
 * @typedef {{ version: string, figmaPublished?: string, changes: Change[] }} Release
 *   `figmaPublished` is the date the Figma file was published, from the `_Published YYYY-MM-DD_`
 *   line in the Figma packages' changelogs, see figma/README.md.
 * @typedef {{ releases: Release[] }} Changelog newest version first
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { toString as textOf } from 'mdast-util-to-string';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { findPackages, NO_CHANGES } from './aggregate-changelogs.js';

const ROOT = process.cwd();
export const CHANGELOG_JSON = path.join(
  ROOT,
  'apps/www/app/content/changelog/changelog.json',
);

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

/** @type {ChangeType[]} biggest first */
export const CHANGE_TYPES = ['major', 'minor', 'patch'];
/** The headings changesets writes in the package changelogs */
export const CHANGE_HEADINGS = {
  major: 'Major Changes',
  minor: 'Minor Changes',
  patch: 'Patch Changes',
};

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkStringify, { bullet: '-', emphasis: '_', listItemIndent: 'one' })
  .freeze();

/** @param {string} markdown */
export const parseMarkdown = (markdown) => processor.parse(markdown);

/** @param {import('mdast').RootContent[]} nodes */
export const toMarkdown = (nodes) =>
  processor.stringify({ type: 'root', children: nodes }).trim();

/** The text of a change without its markup, e.g. `**Dialog:** …` reads `Dialog: …`. */
const plainText = (markdown) => textOf(parseMarkdown(markdown)).trim();

// The line the changeset generator adds before the change of a first-time contributor
const THANKS = /^🎉 Thanks /;
// The packages are versioned together, so these only say that the others were bumped as well
const DEPENDENCY_BUMP = /^Updated dependencies/;

/**
 * The stable versions in a package's CHANGELOG.md, in file order, down to CUTOFF_VERSION.
 * @param {string} md
 * @returns {{ version: string, published?: string, items: { type: ChangeType, markdown: string, thanks?: string }[] }[]}
 */
export function parsePackageChangelog(md) {
  const versions = [];
  let version = null;
  let type = 'patch';
  let thanks;

  for (const node of parseMarkdown(md).children) {
    if (node.type === 'heading' && node.depth === 2) {
      const heading = textOf(node).trim();
      if (heading === CUTOFF_VERSION) break;
      // A pre-release heading, e.g. `## 1.0.0-next.14`, ends the version before it and is left out
      version = /^\d+\.\d+\.\d+$/.test(heading)
        ? { version: heading, items: [] }
        : null;
      if (version) versions.push(version);
      type = 'patch';
      continue;
    }
    if (!version) continue;

    if (node.type === 'heading' && node.depth === 3) {
      const heading = textOf(node).trim();
      type =
        CHANGE_TYPES.find((key) => CHANGE_HEADINGS[key] === heading) ?? type;
    } else if (node.type === 'list') {
      for (const item of node.children) {
        const markdown = toMarkdown(item.children);
        const text = plainText(markdown);
        if (DEPENDENCY_BUMP.test(text)) continue;
        if (THANKS.test(text)) {
          thanks = markdown;
          continue;
        }
        version.items.push({ type, markdown, ...(thanks && { thanks }) });
        thanks = undefined;
      }
    } else if (node.type === 'paragraph') {
      // `_Published YYYY-MM-DD_` under the version heading, in the Figma packages' changelogs
      const published = /^Published (\d{4}-\d{2}-\d{2})$/.exec(
        textOf(node).trim(),
      );
      if (published) version.published = published[1];
    }
  }
  return versions;
}

// Renovate's grouped updates, written in a few ways over time, e.g. "Update npm non-major
// dependencies" or "fix(deps): update npm non-major dependencies". They say nothing more
// than their links, so each version lists them as one change.
const DEPENDENCY_UPDATES =
  /^(?:fix\(deps\): )?updated? (?:npm )?non-major dependencie?s?\b/i;
const DEPENDENCY_UPDATES_TEXT = 'Update npm non-major dependencies';
const isDependencyUpdates = (change) =>
  DEPENDENCY_UPDATES.test(plainText(change.markdown));

/**
 * The links to pull requests, e.g. [#5613](…), and to commits, e.g. [`cc33a61`](…), in a change.
 * @param {string} markdown
 * @returns {import('mdast').Link[]}
 */
function changeLinks(markdown) {
  const links = [];
  const visit = (node) => {
    if (
      node.type === 'link' &&
      /^(?:#\d+|[0-9a-f]{7,40})$/.test(textOf(node))
    ) {
      links.push(node);
    }
    for (const child of node.children ?? []) visit(child);
  };
  visit(parseMarkdown(markdown));
  return links;
}

/**
 * Merges the dependency updates of a version into one change, with the links of all of them, in
 * the place of the first of them.
 * @param {Change[]} changes
 * @returns {Change[]}
 */
function mergeDependencyUpdates(changes) {
  const updates = changes.filter(isDependencyUpdates);
  if (updates.length === 0) return changes;

  const links = new Map();
  for (const update of updates) {
    for (const link of changeLinks(update.markdown)) links.set(link.url, link);
  }
  // Pull requests in number order, then commits
  const linkOrder = (link) =>
    Number(/^#(\d+)$/.exec(textOf(link))?.[1] ?? Infinity);
  const sortedLinks = [...links.values()].sort(
    (a, b) => linkOrder(a) - linkOrder(b),
  );

  /** @type {Change} */
  const merged = {
    type: updates
      .map((update) => update.type)
      .reduce((a, b) =>
        CHANGE_TYPES.indexOf(a) < CHANGE_TYPES.indexOf(b) ? a : b,
      ),
    packages: [...new Set(updates.flatMap((update) => update.packages))].sort(
      (a, b) => packageOrder(a) - packageOrder(b),
    ),
    markdown: toMarkdown([
      {
        type: 'paragraph',
        children: [
          { type: 'text', value: `${DEPENDENCY_UPDATES_TEXT} (` },
          ...sortedLinks.flatMap((link, index) =>
            index === 0 ? [link] : [{ type: 'text', value: ', ' }, link],
          ),
          { type: 'text', value: ')' },
        ],
      },
    ]),
  };

  return changes.flatMap((change) =>
    change === updates[0]
      ? [merged]
      : isDependencyUpdates(change)
        ? []
        : [change],
  );
}

/**
 * The key a change is sorted by: its text without markup and case, so `**Dialog:** …` sorts as
 * `dialog: …`. Dependency updates come last.
 * @param {Change} change
 */
const sortKey = (change) => {
  const key = plainText(change.markdown).toLowerCase();
  return isDependencyUpdates(change) ? `￿${key}` : key;
};

/**
 * Sorts changes by type, biggest first, then alphabetically, see sortKey.
 * @param {Change[]} changes
 */
export const sortChanges = (changes) =>
  changes
    .map((change) => ({ change, key: sortKey(change) }))
    .sort(
      (a, b) =>
        CHANGE_TYPES.indexOf(a.change.type) -
          CHANGE_TYPES.indexOf(b.change.type) ||
        a.key.localeCompare(b.key, 'en', { sensitivity: 'base' }),
    )
    .map(({ change }) => change);

/**
 * Merges the package changelogs into one list of changes per version.
 * @param {Iterable<{ name: string, dir: string }>} pkgs
 * @returns {Promise<Release[]>} newest first
 */
export async function groupChangelogs(pkgs) {
  /** @type {Map<string, { version: string, figmaPublished?: string, changes: Map<string, Change> }>} */
  const releases = new Map();
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
    for (const { version, published, items } of parsePackageChangelog(md)) {
      if (!releases.has(version))
        releases.set(version, { version, changes: new Map() });
      const release = releases.get(version);
      if (published) release.figmaPublished ??= published;

      // The same text in several package changelogs is one change
      for (const { type, markdown, thanks } of items) {
        const change = release.changes.get(markdown) ?? {
          type,
          packages: [],
          markdown,
          ...(thanks && { thanks }),
        };
        // A change is listed under the biggest bump any of its packages got
        if (CHANGE_TYPES.indexOf(type) < CHANGE_TYPES.indexOf(change.type))
          change.type = type;
        // Some package changelogs list the same change twice in a version
        if (!change.packages.includes(pkg.name)) change.packages.push(pkg.name);
        release.changes.set(markdown, change);
      }
    }
  }
  return [...releases.values()]
    .sort((a, b) => compareVersions(b.version, a.version))
    .map(({ version, figmaPublished, changes }) => ({
      version,
      ...(figmaPublished && { figmaPublished }),
      changes: sortChanges(mergeDependencyUpdates([...changes.values()])),
    }));
}

/** Compares two `x.y.z` versions numerically. */
export function compareVersions(a, b) {
  const [x, y] = [a, b].map((v) => v.split('.').map(Number));
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
}

/**
 * The changes of one type as a markdown list, as mdast. Each change can end with more nodes, e.g.
 * the packages it affects.
 * @param {Change[]} changes
 * @param {(change: Change) => import('mdast').BlockContent[]} [after]
 * @returns {import('mdast').List}
 */
export function changeList(changes, after = () => []) {
  const item = (children) => ({ type: 'listItem', spread: true, children });
  return {
    type: 'list',
    ordered: false,
    spread: true,
    children: changes.flatMap((change) => [
      ...(change.thanks ? [item(parseMarkdown(change.thanks).children)] : []),
      item([...parseMarkdown(change.markdown).children, ...after(change)]),
    ]),
  };
}

/**
 * A version as markdown, with the packages each change affects in the line under it, e.g.
 * `` _`figma-plugin` · `figma-ui-kit`_ ``. Used for the GitHub release and the release PR.
 * @param {Release} release
 */
export function formatRelease(release) {
  /** @type {import('mdast').RootContent[]} */
  const nodes = [
    {
      type: 'heading',
      depth: 2,
      children: [{ type: 'text', value: `designsystemet ${release.version}` }],
    },
  ];
  for (const type of CHANGE_TYPES) {
    const changes = release.changes.filter((change) => change.type === type);
    if (changes.length === 0) continue;
    nodes.push(
      {
        type: 'heading',
        depth: 3,
        children: [{ type: 'text', value: CHANGE_HEADINGS[type] }],
      },
      changeList(changes, (change) => [
        {
          type: 'paragraph',
          children: [
            {
              type: 'emphasis',
              children: change.packages.flatMap((name, index) => [
                ...(index === 0 ? [] : [{ type: 'text', value: ' · ' }]),
                { type: 'inlineCode', value: name },
              ]),
            },
          ],
        },
      ]),
    );
  }
  if (release.changes.length === 0) {
    nodes.push({
      type: 'paragraph',
      children: [{ type: 'text', value: NO_CHANGES }],
    });
  }
  return toMarkdown(nodes);
}

/**
 * @param {string} [file]
 * @returns {Promise<Changelog>}
 */
export async function readChangelog(file = CHANGELOG_JSON) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function main() {
  const release = process.argv.indexOf('--release');
  if (release !== -1) {
    const version = process.argv[release + 1]?.replace(/^v/, '');
    const fileArg = process.argv.indexOf('--file');
    const file =
      fileArg === -1 ? CHANGELOG_JSON : path.resolve(process.argv[fileArg + 1]);
    const found = (await readChangelog(file)).releases.find(
      (entry) => entry.version === version,
    );
    if (!found) {
      console.error(`No version ${version} in ${file}`);
      process.exit(1);
    }
    process.stdout.write(`${formatRelease(found)}\n`);
    return;
  }

  /** @type {Map<string, Release>} */
  const releases = new Map();
  if (!process.argv.includes('--all')) {
    try {
      // Keep the versions that are already there as they are, with any edits made by hand
      for (const entry of (await readChangelog()).releases)
        releases.set(entry.version, entry);
    } catch {}
  }
  const existing = releases.size;

  const pkgs = (await findPackages(['packages', 'figma', 'apps'])).values();
  for (const entry of await groupChangelogs(pkgs)) {
    if (!releases.has(entry.version)) releases.set(entry.version, entry);
  }

  /** @type {Changelog} */
  const changelog = {
    releases: [...releases.values()].sort((a, b) =>
      compareVersions(b.version, a.version),
    ),
  };
  await fs.mkdir(path.dirname(CHANGELOG_JSON), { recursive: true });
  await fs.writeFile(
    CHANGELOG_JSON,
    `${JSON.stringify(changelog, null, 2)}\n`,
    'utf8',
  );
  console.log(
    `changelog.json: ${releases.size - existing} version(s) added, ${releases.size} in total.`,
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
