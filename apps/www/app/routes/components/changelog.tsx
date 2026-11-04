import { join } from 'node:path';
import {
  Alert,
  Checkbox,
  Field,
  Fieldset,
  Heading,
  Label,
  Pagination,
  Paragraph,
  Select,
  usePagination,
} from '@digdir/designsystemet-react';
import { Error404 } from '@internal/components';
import cl from 'clsx/lite';
import type { Element, Root } from 'hast';
import { type ComponentProps, createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { isRouteErrorResponse, useSearchParams } from 'react-router';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
import { getFileFromContentDir } from '~/_utils/files.server';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import { generateMetadata } from '~/_utils/metadata';
import type { Route } from './+types/changelog';
import classes from './component.module.css';

const ChangelogFilters = createContext<{
  versions: string[] | null;
  packages: string[] | null;
}>({ versions: null, packages: null });

const RELEASES_PER_PAGE = 10;

function ChangelogSection(props: unknown) {
  const { versions, packages } = useContext(ChangelogFilters);
  const section = props as ComponentProps<'section'> & {
    'data-version'?: string;
    'data-package'?: string;
    'data-packages'?: string;
  };

  if (
    (section['data-version'] &&
      versions &&
      !versions.includes(section['data-version'])) ||
    (packages &&
      section['data-package'] &&
      !packages.includes(section['data-package'])) ||
    (packages &&
      section['data-packages'] &&
      !section['data-packages']
        .split(',')
        .some((name) => packages.includes(name)))
  ) {
    return null;
  }

  return <section {...section} />;
}

function groupChangelog(tree: Root) {
  for (const [index, release] of tree.children.entries()) {
    if (
      !('name' in release) ||
      release.name !== 'div' ||
      !('children' in release)
    )
      continue;
    const heading = release.children.find(
      (child) => child.type === 'element' && child.tagName === 'h2',
    );
    if (heading?.type !== 'element') continue;
    const version = heading.children
      .filter((child) => child.type === 'text')
      .map((child) => child.value)
      .join('');
    const children: Element['children'] = [];
    const packages: string[] = [];
    let currentPackage: Element | undefined;

    for (const child of release.children) {
      if ('name' in child && child.name === 'Divider') continue;
      if (child.type === 'element' && child.tagName === 'h3') {
        const name = child.children
          .filter((node) => node.type === 'text')
          .map((node) => node.value)
          .join('');
        packages.push(name);
        currentPackage = {
          type: 'element',
          tagName: 'section',
          properties: {
            className: [classes.changelogPackage],
            'data-package': name,
          },
          children: [],
        };
        children.push(currentPackage);
      }
      (currentPackage?.children ?? children).push(child);
    }

    tree.children[index] = {
      type: 'element',
      tagName: 'section',
      properties: {
        className: [classes.changelogRelease],
        'data-version': version,
        'data-packages': packages.join(','),
      },
      children,
    };
  }
}

const changelogComponents = { section: ChangelogSection };

export async function loader({ params }: Route.LoaderArgs) {
  // Read the file content
  const fileContent = getFileFromContentDir(
    join('components-docs', `changelog.mdx`),
  );

  if (!fileContent) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  // Bundle the MDX content
  const result = await generateFromMdx(fileContent, groupChangelog);
  const releases: { version: string; packages: string[] }[] = [];
  for (const item of result.toc) {
    if (item.level === 2) {
      releases.push({ version: item.title, packages: [] });
    } else {
      releases.at(-1)?.packages.push(item.title);
    }
  }

  return {
    code: result.code,
    releases,
    versions: releases.map((release) => release.version),
    packages: [
      ...new Set(
        result.toc.filter((item) => item.level === 3).map((item) => item.title),
      ),
    ],
    frontmatter: result.frontmatter,
    lang: params.lang,
    metadata: {
      title: result.frontmatter.title,
    },
  };
}

export const meta = ({ loaderData, location }: Route.MetaArgs) => {
  if (!loaderData)
    return [
      {
        title: 'Designsystemet',
      },
    ];
  const {
    metadata: { title },
    frontmatter,
  } = loaderData;
  return generateMetadata({
    title,
    description: frontmatter.description,
    pathname: location.pathname,
  });
};

export default function Changelogs({
  loaderData: { code, lang, versions, packages, releases },
}: Route.ComponentProps) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedVersion = searchParams.get('version') ?? '';
  const version = versions.includes(requestedVersion) ? requestedVersion : '';
  const selectedPackages = searchParams.has('package')
    ? packages.filter((name) => searchParams.getAll('package').includes(name))
    : packages;
  const filteredReleases = releases.filter(
    (release) =>
      (!version || release.version === version) &&
      selectedPackages.length > 0 &&
      (release.packages.length === 0 ||
        release.packages.some((name) => selectedPackages.includes(name))),
  );
  const totalPages = Math.ceil(filteredReleases.length / RELEASES_PER_PAGE);
  const requestedPage = Number(searchParams.get('page') ?? 1);
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, Math.max(1, totalPages))
      : 1;
  const visibleVersions = filteredReleases
    .slice(
      (currentPage - 1) * RELEASES_PER_PAGE,
      currentPage * RELEASES_PER_PAGE,
    )
    .map((release) => release.version);
  const { pages, prevButtonProps, nextButtonProps } = usePagination({
    currentPage,
    totalPages: Math.max(1, totalPages),
    showPages: 5,
    setCurrentPage: (page) => {
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous);
        next.delete('page');
        if (page > 1) next.set('page', String(page));
        return next;
      });
    },
  });
  const pagination =
    totalPages > 1 ? (
      <Pagination
        aria-label={t('components.changelog.pagination')}
        className={classes.changelogPagination}
        data-size='sm'
      >
        <Pagination.List>
          <Pagination.Item>
            <Pagination.Button
              {...prevButtonProps}
              data-icon
              aria-label={t('components.changelog.previous-page')}
            />
          </Pagination.Item>
          {pages.map(({ page, itemKey, buttonProps }) => (
            <Pagination.Item key={itemKey}>
              {typeof page === 'number' && (
                <Pagination.Button
                  {...buttonProps}
                  aria-label={t('components.changelog.page', { page })}
                >
                  {page}
                </Pagination.Button>
              )}
            </Pagination.Item>
          ))}
          <Pagination.Item>
            <Pagination.Button
              {...nextButtonProps}
              data-icon
              aria-label={t('components.changelog.next-page')}
            />
          </Pagination.Item>
        </Pagination.List>
      </Pagination>
    ) : null;

  function updateFilters(nextVersion: string, nextPackages: string[]) {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        next.delete('version');
        next.delete('package');
        next.delete('page');
        if (nextVersion) next.set('version', nextVersion);
        if (nextPackages.length !== packages.length) {
          for (const name of nextPackages) next.append('package', name);
          if (!nextPackages.length) next.set('package', '');
        }
        return next;
      },
      { preventScrollReset: true },
    );
  }

  return (
    <>
      <div className={classes.textPageHeader}>
        <Heading data-size='lg' level={1}>
          {t('components.changelog.title', 'Changelog')}
        </Heading>
      </div>
      <div
        className={cl(classes.textPage, classes.changelogFilters)}
        data-size='sm'
      >
        <Field className={classes.changelogVersion}>
          <Label htmlFor='changelog-version'>
            {t('components.changelog.version')}
          </Label>
          <Select
            id='changelog-version'
            value={version}
            onChange={(event) =>
              updateFilters(event.target.value, selectedPackages)
            }
          >
            <Select.Option value=''>
              {t('components.changelog.all-versions')}
            </Select.Option>
            {versions.map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Field>
        <Fieldset>
          <Fieldset.Legend>
            {t('components.changelog.packages')}
          </Fieldset.Legend>
          <div className={classes.changelogCheckboxes}>
            {packages.map((name) => (
              <Checkbox
                key={name}
                label={name}
                checked={selectedPackages.includes(name)}
                onChange={(event) =>
                  updateFilters(
                    version,
                    event.target.checked
                      ? [...selectedPackages, name]
                      : selectedPackages.filter((item) => item !== name),
                  )
                }
              />
            ))}
          </div>
        </Fieldset>
      </div>
      {pagination}
      <div
        className={cl(classes.textPage, classes.changelog, 'u-rich-text')}
        lang='en'
      >
        {lang !== 'en' ? (
          <Alert lang='no'>
            Endringslogger er kun tilgjengelige på engelsk
          </Alert>
        ) : null}
        <div role='status' lang={lang}>
          {selectedPackages.length === 0 ? (
            <Paragraph>{t('components.changelog.no-packages')}</Paragraph>
          ) : null}
        </div>
        <ChangelogFilters
          value={{ versions: visibleVersions, packages: selectedPackages }}
        >
          <MDXComponents code={code} components={changelogComponents} />
        </ChangelogFilters>
      </div>
      {pagination}
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useTranslation();

  const message = t('errors.default.title');
  let details = t('errors.default.details');

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <Error404 />;
    }
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
  }

  return (
    <div>
      <Heading level={1}>{message}</Heading>
      <Paragraph>{details}</Paragraph>
    </div>
  );
}
