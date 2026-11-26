/**
 * Builds changelog.json: one entry per version for all packages together, where each change
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
 * merge two entries that describe the same change for different readers, or to write notes about
 * the release in its `notes` field. The notes are shown in the GitHub release and on www.
 *
 * The exported helpers are also used by scripts/sync-changelogs.js to build the changelog pages
 * for www from changelog.json.
 *
 * @typedef {'major' | 'minor' | 'patch'} ChangeType
 * @typedef {{ type: ChangeType, packages: string[], markdown: string, thanks?: string }} Change
 *   `packages` are package names, e.g. `@digdir/designsystemet-css`. `thanks` is the lines the
 *   changeset generator writes before the change, one for each first-time contributor, as
 *   paragraphs.
 * @typedef {{ version: string, figmaPublished?: string, notes?: string, changes: Change[] }} Release
 *   `figmaPublished` is the date the Figma file was published, from the `_Published YYYY-MM-DD_`
 *   line in the Figma packages' changelogs, see figma/README.md. `notes` is markdown written by
 *   hand, e.g. to introduce the release, without headings.
 * @typedef {{ releases: Release[] }} Changelog newest version first
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { toString as textOf } from 'mdast-util-to-string';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';

const ROOT = process.cwd();
export const CHANGELOG_JSON = path.join(ROOT, 'changelog.json');

// Stop at "## 0.101.0" - this is the first entry before version 1
const CUTOFF_VERSION = '0.101.0';

// What a package's changelog says for a version that only bumped it with the others
export const NO_CHANGES = 'No changes in this release.';

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
const isThanks = (text) => text.startsWith('🎉 Thanks ');
// The packages are versioned together, so these only say that the others were bumped as well
const isDependencyBump = (text) => text.startsWith('Updated dependencies');

/**
 * The stable versions in a package's CHANGELOG.md, in file order, down to CUTOFF_VERSION.
 * @param {string} md
 * @returns {{ version: string, published?: string, items: { type: ChangeType, markdown: string, thanks?: string }[] }[]}
 */
export function parsePackageChangelog(md) {
  const versions = [];
  let version = null;
  let type = 'patch';

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
      // Belongs to the change after it in the same list. Dropped with the list, so the thanks for
      // a change that is left out does not end up on a change in another list or version.
      let thanks;
      for (const item of node.children) {
        const markdown = toMarkdown(item.children);
        const text = plainText(markdown);
        if (isDependencyBump(text)) {
          thanks = undefined;
          continue;
        }
        if (isThanks(text)) {
          // One line for each first-time contributor
          thanks = thanks ? `${thanks}\n\n${markdown}` : markdown;
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

// Renovate's grouped updates, written in a few ways over time: "Update npm non-major
// dependencies", "Updated non-major dependencies" or "fix(deps): update npm non-major
// dependencies", some with the last letters left out. They say nothing more than their links,
// so each version lists them as one change. Only the start of the text is matched, so a change
// that mentions non-major dependencies is kept.
const DEPENDENCY_UPDATES_TEXT = 'Update npm non-major dependencies';
const DEPENDENCY_UPDATES =
  /^(?:fix\(deps\): )?(?:update npm|updated) non-major dependenc/i;
const isDependencyUpdates = (change) =>
  DEPENDENCY_UPDATES.test(plainText(change.markdown));

/** The number of the pull request a link goes to, e.g. 5613 for …/pull/5613 */
const pullNumber = (link) => Number(link.url.split('/pull/')[1]);

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
      (node.url.includes('/pull/') || node.url.includes('/commit/'))
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
  const linkOrder = (link) => pullNumber(link) || Infinity;
  const sortedLinks = [...links.values()].sort(
    (a, b) => linkOrder(a) - linkOrder(b),
  );

  const thanks = [
    ...new Set(updates.flatMap((update) => update.thanks ?? [])),
  ].join('\n\n');

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
    ...(thanks && { thanks }),
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
 * Sorts changes by type, biggest first, then alphabetically by their text without markup, so
 * `**Dialog:** …` sorts as `Dialog: …`. Dependency updates come last.
 * @param {Change[]} changes
 */
export const sortChanges = (changes) =>
  changes
    .map((change) => ({
      change,
      text: plainText(change.markdown),
      last: isDependencyUpdates(change),
    }))
    .sort(
      (a, b) =>
        CHANGE_TYPES.indexOf(a.change.type) -
          CHANGE_TYPES.indexOf(b.change.type) ||
        Number(a.last) - Number(b.last) ||
        a.text.localeCompare(b.text, 'en', { sensitivity: 'base' }),
    )
    .map(({ change }) => change);

/**
 * The packages with a changelog: the published ones in packages/, and the private ones that are
 * versioned with them, in figma/ and apps/.
 * @returns {Promise<{ name: string, dir: string }[]>}
 */
async function findPackages() {
  const pkgs = [];
  for await (const file of fs.glob('{packages,figma,apps}/*/CHANGELOG.md', {
    cwd: ROOT,
  })) {
    const dir = path.join(ROOT, path.dirname(file));
    const { name } = JSON.parse(
      await fs.readFile(path.join(dir, 'package.json'), 'utf8'),
    );
    pkgs.push({ name, dir });
  }
  return pkgs;
}

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
    const md = await fs.readFile(path.join(pkg.dir, 'CHANGELOG.md'), 'utf8');
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
      // One list item for each first-time contributor, as in the package changelogs
      ...(change.thanks
        ? parseMarkdown(change.thanks).children.map((node) => item([node]))
        : []),
      item([...parseMarkdown(change.markdown).children, ...after(change)]),
    ]),
  };
}

/**
 * Leaves out HTML comments. They are notes to the editors: hidden on GitHub, and not valid MDX on
 * www. They are left out as nodes, so leaving one out can never join the text around it into a
 * new comment.
 * @template {import('mdast').Nodes} T
 * @param {T[]} nodes
 * @returns {T[]}
 */
const withoutComments = (nodes) =>
  nodes
    .filter((node) => !(node.type === 'html' && /^\s*<!--/.test(node.value)))
    .map((node) =>
      'children' in node
        ? { ...node, children: withoutComments(node.children) }
        : node,
    );

/**
 * The notes about a release, see Release, as mdast.
 * @param {Release} release
 * @returns {import('mdast').RootContent[]}
 */
export const releaseNotes = (release) =>
  release.notes ? withoutComments(parseMarkdown(release.notes).children) : [];

/**
 * A version as markdown, with its notes, and the packages each change affects in the line under
 * it, e.g. `` _`figma-plugin` · `figma-ui-kit`_ ``. Used for the GitHub release and the release PR.
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
    ...releaseNotes(release),
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
  const { values } = parseArgs({
    options: {
      all: { type: 'boolean' },
      release: { type: 'string' },
      file: { type: 'string' },
    },
  });

  if (values.release) {
    const file = values.file ? path.resolve(values.file) : CHANGELOG_JSON;
    const found = (await readChangelog(file)).releases.find(
      (entry) => entry.version === values.release,
    );
    if (!found) {
      console.error(`No version ${values.release} in ${file}`);
      // Told apart from other failures by update-release-pr-body.sh
      process.exit(2);
    }
    process.stdout.write(`${formatRelease(found)}\n`);
    return;
  }

  /** @type {Map<string, Release>} */
  const releases = new Map();
  if (!values.all) {
    // Keep the versions that are already there as they are, with any edits made by hand. Fails
    // on invalid JSON, since rebuilding them would lose those edits.
    for (const entry of (await readChangelog()).releases)
      releases.set(entry.version, entry);
  }
  const existing = releases.size;

  for (const entry of await groupChangelogs(await findPackages())) {
    if (!releases.has(entry.version)) releases.set(entry.version, entry);
  }

  /** @type {Changelog} */
  const changelog = {
    releases: [...releases.values()].sort((a, b) =>
      compareVersions(b.version, a.version),
    ),
  };
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
