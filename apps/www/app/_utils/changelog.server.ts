import type { Nodes as HastNodes, Root as HastRoot } from 'hast';
import { toString as textOf } from 'mdast-util-to-string';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import changelogJson from '~/content/changelog/changelog.json';
import {
  CHANGE_TYPES,
  CHANGELOG_PACKAGES,
  type ChangelogPackageId,
  type ChangeType,
} from './changelog';
import { prettifyCodeBlocks } from './prettify-code-blocks';

/** changelog.json, see scripts/group-changelogs.js */
type Release = {
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
};

const RELEASES_PER_PAGE = 10;

const PACKAGE_IDS = new Map<string, ChangelogPackageId>(
  CHANGELOG_PACKAGES.map(({ packageName, id }) => [packageName, id]),
);

/**
 * changelog.json can be edited by hand, so it is checked when it is read. The build renders the
 * page, so it fails on a mistake instead of leaving something out.
 */
function check({ version, date, figmaPublished, changes }: Release) {
  const fail = (problem: string) => {
    throw new Error(`changelog.json, version ${version}: ${problem}`);
  };
  if (!/^\d+\.\d+\.\d+$/.test(version)) fail('not an x.y.z version');
  for (const day of [date, figmaPublished]) {
    if (day !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(day))
      fail(`${day} is not a YYYY-MM-DD date`);
  }
  for (const { type, packages } of changes) {
    if (!(type in CHANGE_TYPES)) fail(`${type} is not a change type`);
    for (const name of packages) {
      if (!PACKAGE_IDS.has(name)) fail(`${name} is not in CHANGELOG_PACKAGES`);
    }
  }
}

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

/** Without the positions in the markdown, which only make the loader data larger */
const withoutPositions = <T extends HastNodes>(node: T): T => {
  const { position: _, ...rest } = node;
  return (
    'children' in node
      ? { ...rest, children: node.children.map(withoutPositions) }
      : rest
  ) as T;
};

const render = async (markdown: string) =>
  withoutPositions(
    (await processor.run(processor.parse(markdown))) as HastRoot,
  );

/** The text without markup, in lower case, to search in */
const plainText = (markdown: string) =>
  textOf(processor.parse(markdown)).replace(/\s+/g, ' ').trim().toLowerCase();

/** A release with its markdown rendered, and the text of its changes to search in */
async function index(release: Release) {
  check(release);
  const { notes, changes, ...rest } = release;
  return {
    ...rest,
    notes: notes ? await render(notes) : null,
    changes: await Promise.all(
      changes.map(async ({ type, packages, markdown, thanks }) => ({
        type,
        packages: packages.map(
          (name) => PACKAGE_IDS.get(name) as ChangelogPackageId,
        ),
        // The thanks to a first-time contributor comes first
        body: await render(thanks ? `${thanks}\n\n${markdown}` : markdown),
        text: plainText(markdown),
      })),
    ),
  };
}

const { releases } = changelogJson as { releases: Release[] };
/** Rendered once, on the first request */
let indexed: Promise<Awaited<ReturnType<typeof index>>[]> | undefined;

/**
 * One page of the changelog, filtered by the search params of the page:
 * - `version`: only this version
 * - `package`: only the changes in these packages (can be given more than once)
 * - `q`: only the changes with all these words
 * - `page`: the page, of 10 versions each
 *
 * With `allPages`, every version is on one page, e.g. for the markdown version of the page.
 */
export async function getChangelogPage(
  searchParams: URLSearchParams,
  { allPages = false } = {},
) {
  indexed ??= Promise.all(releases.map(index));
  const all = await indexed;

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
  /* A version can be published in Figma without changes in the Figma packages, see
   * figma/README.md. It is kept when filtering on them, so the publish date is shown, but not when
   * searching. */
  const keepFigmaPublished =
    !words.length &&
    packages.some((id) => id === 'figma-plugin' || id === 'figma-ui-kit');

  const matching = all
    .filter((release) => !version || release.version === version)
    .map((release) => ({
      release,
      changes: release.changes.filter(
        (change) =>
          (!packages.length ||
            change.packages.some((id) => packages.includes(id))) &&
          words.every((word) => change.text.includes(word)),
      ),
    }))
    .filter(
      ({ release, changes }) =>
        !isFiltered ||
        changes.length > 0 ||
        (keepFigmaPublished && release.figmaPublished),
    );

  const perPage = allPages ? Math.max(1, all.length) : RELEASES_PER_PAGE;
  const totalPages = Math.max(1, Math.ceil(matching.length / perPage));
  const requestedPage = Number(searchParams.get('page') ?? 1);
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, totalPages)
      : 1;

  return {
    releases: matching
      .slice((page - 1) * perPage, page * perPage)
      .map(({ release, changes }) => ({
        version: release.version,
        date: release.date,
        figmaPublished: release.figmaPublished,
        /* Notes are about the whole release, not one package, and are not searched, so they are
         * left out while filtering */
        notes: isFiltered ? null : release.notes,
        /* Of the changes that are shown, so a version kept for its Figma publish date says it has
         * no changes in the selected packages */
        hasChanges: changes.length > 0,
        groups: (Object.keys(CHANGE_TYPES) as ChangeType[])
          .map((type) => ({
            type,
            changes: changes
              .filter((change) => change.type === type)
              .map(({ packages, body }) => ({ packages, body })),
          }))
          .filter((group) => group.changes.length > 0),
      })),
    /** Every version, for links to the old changelog pages, e.g. `#1240` */
    versions: all.map((release) => release.version),
    filters: { version, packages, query, page },
    /** The number of versions that match the filters */
    total: matching.length,
    /** The number of changes with the words searched for, when searching */
    matchCount: words.length
      ? matching.reduce((sum, { changes }) => sum + changes.length, 0)
      : null,
    /** At least 1 */
    totalPages,
  };
}

export type ChangelogPage = Awaited<ReturnType<typeof getChangelogPage>>;
export type ChangelogPageRelease = ChangelogPage['releases'][number];
