import type { Nodes as HastNodes, Root as HastRoot } from 'hast';
import { toString as textOf } from 'mdast-util-to-string';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import {
  CHANGE_TYPES,
  CHANGELOG_PACKAGES,
  type ChangelogPackageId,
  type ChangeType,
} from './changelog';
import { getFileFromContentDir } from './files.server';
import { prettifyCodeBlocks } from './prettify-code-blocks';

/** changelog.json, see scripts/group-changelogs.js */
type ChangelogJson = {
  releases: {
    version: string;
    date?: string;
    figmaPublished?: string;
    notes?: string;
    changes: {
      type: ChangeType;
      packages: string[];
      markdown: string;
      thanks?: string;
    }[];
  }[];
};

type IndexedChange = {
  type: ChangeType;
  packages: ChangelogPackageId[];
  /** Markdown, with the thanks to a first-time contributor before it */
  markdown: string;
  /** The text without markup, in lower case, to search in */
  text: string;
};

type IndexedRelease = Omit<ChangelogJson['releases'][number], 'changes'> & {
  changes: IndexedChange[];
};

const RELEASES_PER_PAGE = 10;

const PACKAGE_IDS = new Map<string, ChangelogPackageId>(
  CHANGELOG_PACKAGES.map(({ packageName, id }) => [packageName, id]),
);

const isDate = (date?: string) => /^\d{4}-\d{2}-\d{2}$/.test(date ?? '');

/**
 * Markdown to hast. Raw HTML in the markdown is left out (remark-rehype does not keep it), so are
 * HTML comments, and rehype-sanitize removes what could run script, e.g. `javascript:` links.
 * changelog.json is written from changesets, which anyone can open a pull request with.
 */
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(prettifyCodeBlocks);

const plainText = (markdown: string) =>
  textOf(processor.parse(markdown)).replace(/\s+/g, ' ').trim().toLowerCase();

/** Without the positions in the markdown, which only make the loader data larger */
const withoutPositions = <T extends HastNodes>(node: T): T => {
  const { position: _, ...rest } = node;
  return (
    'children' in node
      ? { ...rest, children: node.children.map(withoutPositions) }
      : rest
  ) as T;
};

const rendered = new Map<string, Promise<HastRoot>>();

/** The markdown as hast, made once for each text */
function render(markdown: string) {
  let tree = rendered.get(markdown);
  if (!tree) {
    tree = processor
      .run(processor.parse(markdown))
      .then((root) => withoutPositions(root as HastRoot));
    rendered.set(markdown, tree);
  }
  return tree;
}

let cache: { source: string; releases: IndexedRelease[] } | undefined;

/** The releases in changelog.json, newest first, read again when the file changes */
function readChangelog(): IndexedRelease[] | null {
  const source = getFileFromContentDir('changelog/changelog.json');
  if (!source) return null;
  if (cache?.source === source) return cache.releases;

  const { releases } = JSON.parse(source) as ChangelogJson;
  const indexed = releases
    // Edited by hand, so only what can be shown
    .filter(({ version }) => /^\d+\.\d+\.\d+$/.test(version))
    .map(({ changes, ...release }) => ({
      ...release,
      changes: changes
        .filter(({ type }) => type in CHANGE_TYPES)
        .map(({ type, packages, markdown, thanks }) => ({
          type,
          packages: CHANGELOG_PACKAGES.filter(({ packageName }) =>
            packages.includes(packageName),
          ).map(({ id }) => id),
          markdown: thanks ? `${thanks}\n\n${markdown}` : markdown,
          text: plainText(markdown),
        })),
    }));
  for (const name of new Set(
    releases.flatMap(({ changes }) => changes.flatMap((c) => c.packages)),
  )) {
    if (!PACKAGE_IDS.has(name))
      console.warn(`changelog.json: ${name} is not in CHANGELOG_PACKAGES`);
  }
  cache = { source, releases: indexed };
  return indexed;
}

/**
 * One page of the changelog, filtered by the search params of the page:
 * - `version`: only this version
 * - `package`: only the changes in these packages (can be given more than once)
 * - `q`: only the changes with all these words
 * - `page`: the page, of 10 versions each
 *
 * Returns null when there is no changelog.
 */
export async function getChangelogPage(searchParams: URLSearchParams) {
  const all = readChangelog();
  if (!all) return null;

  const requestedVersion = searchParams.get('version') ?? '';
  const version = all.some((release) => release.version === requestedVersion)
    ? requestedVersion
    : '';
  // No selected packages means no filter: changes in all packages are shown
  const packages = CHANGELOG_PACKAGES.map(({ id }) => id).filter((id) =>
    searchParams.getAll('package').includes(id),
  );
  const query = searchParams.get('q')?.trim() ?? '';
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const isFiltered = packages.length > 0 || words.length > 0;

  const matches = (change: IndexedChange) =>
    (!packages.length || change.packages.some((id) => packages.includes(id))) &&
    words.every((word) => change.text.includes(word));

  const releases = all
    .filter((release) => !version || release.version === version)
    .map((release) => ({
      release,
      changes: isFiltered ? release.changes.filter(matches) : release.changes,
    }))
    .filter(({ changes }) => !isFiltered || changes.length > 0);

  const totalPages = Math.ceil(releases.length / RELEASES_PER_PAGE);
  const requestedPage = Number(searchParams.get('page') ?? 1);
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, Math.max(1, totalPages))
      : 1;

  const pageReleases = await Promise.all(
    releases
      .slice((page - 1) * RELEASES_PER_PAGE, page * RELEASES_PER_PAGE)
      .map(async ({ release, changes }) => ({
        version: release.version,
        date: isDate(release.date) ? release.date : undefined,
        figmaPublished: isDate(release.figmaPublished)
          ? release.figmaPublished
          : undefined,
        /* Notes are about the whole release, not one package, and are not searched, so they are
         * left out while filtering */
        notes:
          release.notes && !isFiltered ? await render(release.notes) : null,
        hasChanges: release.changes.length > 0,
        groups: await Promise.all(
          (Object.keys(CHANGE_TYPES) as ChangeType[])
            .map((type) => ({
              type,
              changes: changes.filter((change) => change.type === type),
            }))
            .filter((group) => group.changes.length > 0)
            .map(async ({ type, changes }) => ({
              type,
              changes: await Promise.all(
                changes.map(async (change) => ({
                  packages: change.packages,
                  body: await render(change.markdown),
                })),
              ),
            })),
        ),
      })),
  );

  return {
    releases: pageReleases,
    /** Every version, for links to the old changelog pages, e.g. `#1240` */
    versions: all.map((release) => release.version),
    filters: { version, packages, query, page },
    isFiltered: Boolean(version) || isFiltered,
    /** The number of versions that match the filters */
    total: releases.length,
    /** The number of changes with the words searched for, when searching */
    matchCount: words.length
      ? releases.reduce((sum, { changes }) => sum + changes.length, 0)
      : null,
    totalPages,
  };
}

export type ChangelogPage = NonNullable<
  Awaited<ReturnType<typeof getChangelogPage>>
>;
export type ChangelogPageRelease = ChangelogPage['releases'][number];
