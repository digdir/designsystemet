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
 *   pnpm node scripts/group-changelogs.ts                     adds the versions that are missing from changelog.json
 *   pnpm node scripts/group-changelogs.ts --all               rebuilds every version
 *   pnpm node scripts/group-changelogs.ts --release <version> prints the version as markdown, for its
 *                                                             GitHub release (see create-aggregated-release.sh)
 *                                                             and the release PR (see update-release-pr-body.sh)
 *   pnpm node scripts/group-changelogs.ts --check             only checks changelog.json, e.g. after it was
 *                                                             edited by hand, and that every package is listed
 *     --file <path>                                           with --release or --check: reads that
 *                                                             changelog.json instead, e.g. from the release
 *                                                             PR's branch
 *
 * Versions already in changelog.json are kept as they are, so they can be edited by hand, e.g. to
 * merge two entries that describe the same change for different readers, or to write notes about
 * the release in its `notes` field, or to add the date the Figma file was published (see
 * figma/README.md). The notes are shown in the GitHub release and on www. Only their release
 * date is added when it is missing, see changelog-dates.ts. The versions are checked when they
 * are read, see checkRelease.
 *
 * `--all` loses those edits, except for the dates the Figma file was published.
 *
 * The changelog page on www reads changelog.json, see apps/www/app/_utils/changelog.server.ts.
 *
 * The shape of changelog.json is in changelog-types.ts. Node strips the types when it runs this.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import type {
  Link,
  List,
  ListItem,
  Nodes,
  Paragraph,
  PhrasingContent,
  RootContent,
} from 'mdast';
import { toString as textOf } from 'mdast-util-to-string';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { addReleaseDates } from './changelog-dates.ts';
import { CHANGELOG_PACKAGES } from './changelog-packages.ts';
import {
  CHANGE_HEADINGS,
  type Change,
  type Changelog,
  type ChangeType,
  type Release,
} from './changelog-types.ts';

const ROOT = process.cwd();
const CHANGELOG_JSON = path.join(ROOT, 'changelog.json');

// Stop at "## 0.101.0" - this is the first entry before version 1
const CUTOFF_VERSION = '0.101.0';

// What the GitHub release and the release PR say for a version without changes
const NO_CHANGES = 'No changes in this release.';

/** The order packages are listed in under each change, see changelog-packages.ts */
const PACKAGE_ORDER: string[] = CHANGELOG_PACKAGES.map(
  ({ packageName }) => packageName,
);
const packageOrder = (name: string) => {
  const index = PACKAGE_ORDER.indexOf(name);
  if (index === -1)
    throw new Error(
      `${name} is not in CHANGELOG_PACKAGES in scripts/changelog-packages.ts`,
    );
  return index;
};

/** Biggest first */
const CHANGE_TYPES = Object.keys(CHANGE_HEADINGS) as ChangeType[];

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkStringify, { bullet: '-', emphasis: '_', listItemIndent: 'one' })
  .freeze();

const parseMarkdown = (markdown: string) => processor.parse(markdown);

const toMarkdown = (nodes: RootContent[]) =>
  processor.stringify({ type: 'root', children: nodes }).trim();

/** The text of a change without its markup, e.g. `**Dialog:** …` reads `Dialog: …`. */
const plainText = (markdown: string) => textOf(parseMarkdown(markdown)).trim();

// The line the changeset generator adds before the change of a first-time contributor
const isThanks = (text: string) => text.startsWith('🎉 Thanks ');
// The packages are versioned together, so these only say that the others were bumped as well.
// Only the line changesets wrote, `Updated dependencies [<commits>]:`, so a change that someone
// wrote with the same first words is kept.
const isDependencyBump = (text: string) =>
  /^Updated dependencies \[[^\]]*\]:/.test(text);

/** A version in a package's CHANGELOG.md, with its changes as they are written there */
type PackageVersion = {
  version: string;
  items: { type: ChangeType; markdown: string; thanks?: string }[];
};

/** The stable versions in a package's CHANGELOG.md, in file order, down to CUTOFF_VERSION. */
function parsePackageChangelog(md: string): PackageVersion[] {
  const versions: PackageVersion[] = [];
  let version: PackageVersion | null = null;
  let type: ChangeType = 'patch';

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
      let thanks: string | undefined;
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
const isDependencyUpdates = (change: Change) =>
  DEPENDENCY_UPDATES.test(plainText(change.markdown));

/** The number of the pull request a link goes to, e.g. 5613 for …/pull/5613 */
const pullNumber = (link: Link) => Number(link.url.split('/pull/')[1]);

/** The links to pull requests, e.g. [#5613](…), and to commits, e.g. [`cc33a61`](…), in a change. */
function changeLinks(markdown: string): Link[] {
  const links: Link[] = [];
  const visit = (node: Nodes) => {
    if (
      node.type === 'link' &&
      (node.url.includes('/pull/') || node.url.includes('/commit/'))
    ) {
      links.push(node);
    }
    if ('children' in node) node.children.forEach(visit);
  };
  visit(parseMarkdown(markdown));
  return links;
}

/**
 * Merges the dependency updates of a version into one change, with the links of all of them, in
 * the place of the first of them.
 */
function mergeDependencyUpdates(changes: Change[]): Change[] {
  const updates = changes.filter(isDependencyUpdates);
  if (updates.length === 0) return changes;

  const links = new Map<string, Link>();
  for (const update of updates) {
    for (const link of changeLinks(update.markdown)) links.set(link.url, link);
  }
  // Pull requests in number order, then commits
  const linkOrder = (link: Link) => pullNumber(link) || Infinity;
  const sortedLinks = [...links.values()].sort(
    (a, b) => linkOrder(a) - linkOrder(b),
  );

  const thanks = [
    ...new Set(updates.flatMap((update) => update.thanks ?? [])),
  ].join('\n\n');

  const text = (value: string): PhrasingContent => ({ type: 'text', value });
  const merged: Change = {
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
          text(`${DEPENDENCY_UPDATES_TEXT} (`),
          ...sortedLinks.flatMap((link, index) =>
            index === 0 ? [link] : [text(', '), link],
          ),
          text(')'),
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
 */
const sortChanges = (changes: Change[]) =>
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
 */
async function findPackages() {
  const pkgs: { name: string; dir: string }[] = [];
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
 * Merges the package changelogs into one list of changes per version. Newest first, without
 * dates.
 */
async function groupChangelogs(
  pkgs: Iterable<{ name: string; dir: string }>,
): Promise<Release[]> {
  const releases = new Map<
    string,
    { version: string; changes: Map<string, Change> }
  >();
  const sorted = [...pkgs].sort(
    (a, b) => packageOrder(a.name) - packageOrder(b.name),
  );
  for (const pkg of sorted) {
    const md = await fs.readFile(path.join(pkg.dir, 'CHANGELOG.md'), 'utf8');
    for (const { version, items } of parsePackageChangelog(md)) {
      const release = releases.get(version) ?? { version, changes: new Map() };
      releases.set(version, release);

      // The same text in several package changelogs is one change
      for (const { type, markdown, thanks } of items) {
        const change: Change = release.changes.get(markdown) ?? {
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
    .map(({ version, changes }) => ({
      version,
      changes: sortChanges(mergeDependencyUpdates([...changes.values()])),
    }));
}

/** Compares two `x.y.z` versions numerically. */
function compareVersions(a: string, b: string) {
  const [x, y] = [a, b].map((v) => v.split('.').map(Number));
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
}

/**
 * The packages a change affects, as a line under it, e.g. `` _`figma-plugin` · `figma-ui-kit`_ ``.
 */
const packagesLine = (change: Change): Paragraph => ({
  type: 'paragraph',
  children: [
    {
      type: 'emphasis',
      children: change.packages.flatMap((name, index): PhrasingContent[] => [
        ...(index === 0 ? [] : [{ type: 'text' as const, value: ' · ' }]),
        { type: 'inlineCode', value: name },
      ]),
    },
  ],
});

/** The changes of one type as a markdown list, as mdast, each with the packages it affects. */
function changeList(changes: Change[]): List {
  // What is at the top of a change, e.g. paragraphs, tables and code, can be in a list item
  const item = (children: RootContent[]): ListItem => ({
    type: 'listItem',
    spread: true,
    children: children as ListItem['children'],
  });
  return {
    type: 'list',
    ordered: false,
    spread: true,
    children: changes.flatMap((change) => [
      // One list item for each first-time contributor, as in the package changelogs
      ...(change.thanks
        ? parseMarkdown(change.thanks).children.map((node) => item([node]))
        : []),
      item([...parseMarkdown(change.markdown).children, packagesLine(change)]),
    ]),
  };
}

/**
 * A version as markdown, with its notes, and the packages each change affects in the line under
 * it. Used for the GitHub release and the release PR.
 */
function formatRelease(release: Release) {
  const nodes: RootContent[] = [
    {
      type: 'heading',
      depth: 2,
      children: [{ type: 'text', value: `designsystemet ${release.version}` }],
    },
    ...(release.notes ? parseMarkdown(release.notes).children : []),
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
      changeList(changes),
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

/** A `YYYY-MM-DD` date that exists, so not e.g. 2026-13-40 */
const isDate = (day: unknown) =>
  typeof day === 'string' &&
  /^\d{4}-\d{2}-\d{2}$/.test(day) &&
  !Number.isNaN(Date.parse(day)) &&
  new Date(day).toISOString().startsWith(day);

const RELEASE_KEYS = ['version', 'date', 'figmaPublished', 'notes', 'changes'];
const CHANGE_KEYS = ['type', 'packages', 'markdown', 'thanks'];

/**
 * changelog.json can be edited by hand, so each version is checked when it is read. A mistake
 * fails here, before the release, instead of leaving something out of the GitHub release or the
 * changelog page on www, which show the versions as they are.
 *
 * The version is typed as it should be, but can be anything, so every part of it is checked.
 */
function checkRelease(release: Release) {
  const { version, date, figmaPublished, notes, changes } = release;
  const fail: (problem: string) => never = (problem) => {
    throw new Error(`changelog.json, version ${version}: ${problem}`);
  };
  const isText = (value: unknown) =>
    typeof value === 'string' && value.trim() !== '';
  // e.g. `note` for `notes`, which would be left out without a word
  const checkKeys = (object: object, keys: string[]) => {
    for (const key of Object.keys(object))
      if (!keys.includes(key)) fail(`${key} is not one of ${keys.join(', ')}`);
  };

  if (!/^\d+\.\d+\.\d+$/.test(version)) fail('not an x.y.z version');
  checkKeys(release, RELEASE_KEYS);
  for (const day of [date, figmaPublished]) {
    if (day !== undefined && !isDate(day))
      fail(`${day} is not a YYYY-MM-DD date`);
  }
  if (notes !== undefined && !isText(notes)) fail('notes is not text');
  // They are shown under the heading of the version, in the GitHub release and on www
  if (notes && parseMarkdown(notes).children.some((n) => n.type === 'heading'))
    fail('notes has a heading');
  if (!Array.isArray(changes)) fail('has no list of changes');
  for (const change of changes) {
    if (!change || typeof change !== 'object')
      fail('a change is not an object');
    const { type, packages, markdown, thanks } = change;
    checkKeys(change, CHANGE_KEYS);
    if (!CHANGE_TYPES.includes(type)) fail(`${type} is not a change type`);
    if (!isText(markdown)) fail('a change has no markdown');
    if (thanks !== undefined && !isText(thanks)) fail('thanks is not text');
    if (!Array.isArray(packages) || packages.length === 0)
      fail('a change has no packages');
    for (const name of packages) {
      if (!PACKAGE_ORDER.includes(name))
        fail(`${name} is not in CHANGELOG_PACKAGES`);
    }
  }
}

/**
 * Checks every version, and that each is there once. Both what is read and what is written go
 * through here, so the file can't be written in a way it is not read back. Returns it as it was
 * given.
 */
function checkChangelog(changelog: Changelog): Changelog {
  if (!Array.isArray(changelog?.releases))
    throw new Error('changelog.json has no list of releases');
  const versions = new Set<string>();
  for (const release of changelog.releases) {
    if (!release || typeof release !== 'object')
      throw new Error('changelog.json has a release that is not an object');
    checkRelease(release);
    if (versions.has(release.version))
      throw new Error(`changelog.json has version ${release.version} twice`);
    versions.add(release.version);
  }
  return changelog;
}

/** The changelog in this file, checked */
const readChangelog = async (file: string): Promise<Changelog> =>
  checkChangelog(JSON.parse(await fs.readFile(file, 'utf8')));

/**
 * Fails when a package that is versioned with the others is not in CHANGELOG_PACKAGES. It gets a
 * changelog at its first release, which this script then fails on (see packageOrder), so it is
 * found here, in the pull request that adds the package. Changesets leaves out the packages in
 * its `ignore` list and the ones without a version, so they get no changelog.
 */
async function checkPackages() {
  const { ignore } = JSON.parse(
    await fs.readFile(path.join(ROOT, '.changeset/config.json'), 'utf8'),
  );
  for await (const file of fs.glob('{packages,figma,apps}/*/package.json', {
    cwd: ROOT,
  })) {
    const { name, version } = JSON.parse(
      await fs.readFile(path.join(ROOT, file), 'utf8'),
    );
    if (version && !ignore.includes(name)) packageOrder(name);
  }
}

async function main() {
  const { values } = parseArgs({
    options: {
      all: { type: 'boolean' },
      release: { type: 'string' },
      file: { type: 'string' },
      check: { type: 'boolean' },
    },
  });

  // For `--check` and `--release`. The versions are always written to changelog.json, so it
  // fails with the other modes, where it would be taken for the file that is written.
  if (values.file && !values.check && !values.release)
    throw new Error('--file is only for --check and --release');
  const file = values.file ? path.resolve(values.file) : CHANGELOG_JSON;

  if (values.check) {
    const { releases } = await readChangelog(file);
    await checkPackages();
    console.log(`changelog.json: ${releases.length} version(s) checked.`);
    return;
  }

  if (values.release) {
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

  // Fails on invalid JSON, since rebuilding the versions would lose the edits made by hand
  const stored = (await readChangelog(CHANGELOG_JSON)).releases;
  const releases = new Map<string, Release>();
  if (!values.all) {
    // Keep the versions that are already there as they are, with any edits made by hand
    for (const entry of stored) releases.set(entry.version, entry);
  }
  const existing = releases.size;

  for (const entry of await groupChangelogs(await findPackages())) {
    if (releases.has(entry.version)) continue;
    // Only with `--all`: the date the Figma file was published is only written in
    // changelog.json, so it is kept when the version is built again
    const figmaPublished = stored.find(
      ({ version }) => version === entry.version,
    )?.figmaPublished;
    releases.set(entry.version, {
      version: entry.version,
      ...(figmaPublished && { figmaPublished }),
      changes: entry.changes,
    });
  }

  // Checked before it is written, like when it is read
  const changelog = checkChangelog({
    releases: addReleaseDates(
      [...releases.values()].sort((a, b) =>
        compareVersions(b.version, a.version),
      ),
      // Every version is rebuilt without its date, so they must all be found again
      { required: Boolean(values.all) },
    ),
  });
  await fs.writeFile(
    CHANGELOG_JSON,
    `${JSON.stringify(changelog, null, 2)}\n`,
    'utf8',
  );
  console.log(
    `changelog.json: ${releases.size - existing} version(s) added, ${releases.size} in total.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
