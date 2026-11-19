import type { Element, ElementContent, Root } from 'hast';

/** The packages in the changelog, in the order they are shown. */
export const CHANGELOG_PACKAGES = [
  { name: '@digdir/designsystemet', id: 'cli', label: 'CLI', color: 'neutral' },
  {
    name: '@digdir/designsystemet-css',
    id: 'css',
    label: 'CSS',
    color: 'brand1',
  },
  {
    name: '@digdir/designsystemet-react',
    id: 'react',
    label: 'React',
    color: 'accent',
  },
  {
    name: '@digdir/designsystemet-web',
    id: 'web',
    label: 'Web',
    color: 'brand2',
  },
  {
    name: '@digdir/designsystemet-types',
    id: 'types',
    label: 'Types',
    color: 'brand3',
  },
] as const;

export type ChangelogPackageId = (typeof CHANGELOG_PACKAGES)[number]['id'];

export const CHANGE_TYPES = ['major', 'minor', 'patch'] as const;
export type ChangeType = (typeof CHANGE_TYPES)[number];

const NO_CHANGES = 'No changes in this release.';

const packageId = (name: string) =>
  CHANGELOG_PACKAGES.find((pkg) => pkg.name === name.trim())?.id;

const sortPackages = (ids: Iterable<string>) => {
  const set = new Set(ids);
  return CHANGELOG_PACKAGES.map((pkg) => pkg.id).filter((id) => set.has(id));
};

/** hast nodes and the MDX JSX nodes (`<div>`, `<Divider/>`, `<time>`) that live in the same tree */
type Node = {
  type: string;
  tagName?: string;
  name?: string | null;
  value?: string;
  children?: Node[];
  attributes?: { name?: string; value?: unknown }[];
};

const text = (node: Node): string =>
  node.type === 'text'
    ? (node.value ?? '')
    : (node.children ?? []).map(text).join('');

/** Routine dependency updates, e.g. "Update npm non-major dependencies" or "fix(deps): update npm non-major dependencie" */
const DEPENDENCY_UPDATE =
  /^(fix\(deps\):\s*)?updated?( npm)? non-major dependenc/i;
const DEPENDENCY_UPDATE_KEY = 'dependency-update';
const DEPENDENCY_UPDATE_TITLE = 'Update npm non-major dependencies';

/** The pull request and commit links in a change, without links to authors (`@renovate`) */
const findLinks = (node: Node): Node[] =>
  isElement(node, 'a')
    ? text(node).startsWith('@')
      ? []
      : [node]
    : (node.children ?? []).flatMap(findLinks);

const isElement = (node: Node, tagName: string) =>
  node.type === 'element' && node.tagName === tagName;

const findDate = (node: Node): string | undefined => {
  if (node.name === 'time') {
    const value = node.attributes?.find(
      (attribute) => attribute.name === 'dateTime',
    )?.value;
    if (typeof value === 'string') return value;
  }
  for (const child of node.children ?? []) {
    const date = findDate(child);
    if (date) return date;
  }
};

const element = (
  tagName: string,
  properties: Element['properties'],
  children: ElementContent[],
): Element => ({ type: 'element', tagName, properties, children });

/**
 * Restructures the generated changelog (scripts/sync-changelogs.js), which lists every change
 * once per package it was released in:
 *
 *   <div> ## version, <small><time/></small>, ### package, #### Patch Changes, - change … </div>
 *
 * into one section per release where changes are grouped by type, and a change released in
 * several packages is listed once with the packages it applies to:
 *
 *   <section data-release data-packages>
 *     <header> <div> <h2>version</h2> <time/> </div> </header>
 *     <section data-change-type data-packages> <ul> <li data-packages>change</li> … </ul> </section>
 *   </section>
 */
export function groupChangelog(tree: Root) {
  const nodes = tree.children as unknown as Node[];

  for (const [index, release] of nodes.entries()) {
    if (release.name !== 'div' || !release.children) continue;
    const heading = release.children.find((child) => isElement(child, 'h2'));
    if (!heading) continue;

    const version = text(heading).trim();
    const date = findDate(release);
    const groups = new Map<
      ChangeType,
      Map<string, { item: Node; packages: Set<string> }>
    >();
    let currentPackage: string | undefined;
    let currentType: ChangeType | undefined;

    const add = (item: Node) => {
      if (!currentPackage || !currentType) return;
      const content = text(item).trim();
      if (!content || content === NO_CHANGES) return;
      const changes = groups.get(currentType) ?? new Map();
      groups.set(currentType, changes);

      // Routine dependency updates are many and say the same, so they are merged into one change
      // that links to all of them
      if (DEPENDENCY_UPDATE.test(content)) {
        const change = changes.get(DEPENDENCY_UPDATE_KEY) ?? {
          item: { type: 'element', tagName: 'li', children: [] },
          packages: new Set(),
        };
        changes.set(DEPENDENCY_UPDATE_KEY, change);
        change.packages.add(currentPackage);
        const links = change.item.children ?? [];
        for (const link of findLinks(item)) {
          if (!links.some((other: Node) => text(other) === text(link))) {
            links.push(link);
          }
        }
        return;
      }

      const change = changes.get(content) ?? { item, packages: new Set() };
      changes.set(content, change);
      change.packages.add(currentPackage);
    };

    for (const child of release.children) {
      if (isElement(child, 'h3')) {
        currentPackage = packageId(text(child));
        currentType = undefined;
      } else if (isElement(child, 'h4')) {
        const type = text(child).trim().split(' ')[0].toLowerCase();
        currentType = CHANGE_TYPES.find((item) => item === type) ?? 'patch';
      } else if (isElement(child, 'ul')) {
        for (const item of child.children ?? []) {
          if (isElement(item, 'li')) add(item);
        }
      } else if (isElement(child, 'p') || isElement(child, 'table')) {
        // Loose content under a change type, kept as a change of its own
        add({ type: 'element', tagName: 'li', children: [child] });
      }
    }

    const releasePackages = new Set<string>();
    const sections: ElementContent[] = [];
    for (const type of CHANGE_TYPES) {
      const changes = groups.get(type);
      if (!changes) continue;
      const typePackages = new Set<string>();

      // Listed last, after the changes that are worth reading
      const dependencyUpdate = changes.get(DEPENDENCY_UPDATE_KEY);
      if (dependencyUpdate) {
        const links = dependencyUpdate.item.children ?? [];
        dependencyUpdate.item.children = [
          {
            type: 'text',
            value: DEPENDENCY_UPDATE_TITLE + (links.length ? ' (' : ''),
          },
          ...links.flatMap((link, index) =>
            index ? [{ type: 'text', value: ', ' }, link] : [link],
          ),
          ...(links.length ? [{ type: 'text', value: ')' }] : []),
        ];
        changes.delete(DEPENDENCY_UPDATE_KEY);
        changes.set(DEPENDENCY_UPDATE_KEY, dependencyUpdate);
      }
      const items = [...changes.values()].map(({ item, packages }) => {
        for (const id of packages) {
          typePackages.add(id);
          releasePackages.add(id);
        }
        return element(
          'li',
          { 'data-packages': sortPackages(packages).join(',') },
          (item.children ?? []) as ElementContent[],
        );
      });
      sections.push(
        element(
          'section',
          {
            'data-change-type': type,
            'data-packages': sortPackages(typePackages).join(','),
          },
          [element('ul', {}, items)],
        ),
      );
    }

    if (!sections.length) {
      sections.push(element('p', {}, [{ type: 'text', value: NO_CHANGES }]));
    }

    // Rendered as a link to the release, see ChangelogVersion
    const header = [element('h2', { 'data-version': version }, [])];
    if (date) header.push(element('time', { dateTime: date }, []));

    nodes[index] = element(
      'section',
      {
        'data-release': version,
        'data-packages': sortPackages(releasePackages).join(','),
      },
      [element('header', {}, [element('div', {}, header)]), ...sections],
    ) as unknown as Node;
  }
}

/** The releases in the generated changelog, with the packages that have changes in each. */
export function parseReleases(source: string) {
  return source
    .split(/^## /m)
    .slice(1)
    .map((release) => ({
      version: release.slice(0, release.indexOf('\n')).trim(),
      packages: sortPackages(
        [
          ...release.matchAll(
            /^### (.+)\n+(?!\n|No changes in this release\.)/gm,
          ),
        ]
          .map((match) => packageId(match[1]))
          .filter((id) => id !== undefined),
      ),
    }));
}
