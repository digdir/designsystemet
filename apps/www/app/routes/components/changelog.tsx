import { join } from 'node:path';
import {
  Alert,
  Button,
  Chip,
  Field,
  Fieldset,
  Heading,
  Label,
  Pagination,
  Paragraph,
  Select,
  Tag,
  usePagination,
} from '@digdir/designsystemet-react';
import { Error404 } from '@internal/components';
import {
  ExclamationmarkTriangleIcon,
  PackageIcon,
  SparklesIcon,
} from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import {
  type ComponentProps,
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  isRouteErrorResponse,
  Link as RRLink,
  type ShouldRevalidateFunctionArgs,
  useLocation,
  useNavigation,
  useSearchParams,
} from 'react-router';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
import { getFileFromContentDir } from '~/_utils/files.server';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import {
  CHANGELOG_PACKAGES,
  type ChangeType,
  groupChangelog,
  parseReleases,
} from '~/_utils/group-changelog';
import { generateMetadata } from '~/_utils/metadata';
import type { Route } from './+types/changelog';
import classes from './component.module.css';

const RELEASES_PER_PAGE = 10;

const CHANGE_TYPES = {
  major: { title: 'Major Changes', icon: ExclamationmarkTriangleIcon },
  minor: { title: 'Minor Changes', icon: SparklesIcon },
  patch: { title: 'Patch Changes', icon: PackageIcon },
} satisfies Record<ChangeType, unknown>;

const ChangelogFilters = createContext<{
  /** The releases on the current page */
  versions: string[];
  /** The packages to show changes for, or null for all */
  packages: string[] | null;
  lang: string;
}>({ versions: [], packages: null, lang: 'en' });

type DataProps = {
  'data-release'?: string;
  'data-change-type'?: ChangeType;
  'data-packages'?: string;
};

function useIsFiltered(packages?: string) {
  const { packages: selected } = useContext(ChangelogFilters);
  if (!selected || !packages) return false;
  return !packages.split(',').some((id) => selected.includes(id));
}

/** A release, or the changes of one type in a release. See groupChangelog for the structure. */
function ChangelogSection(props: unknown) {
  const {
    'data-release': release,
    'data-change-type': type,
    'data-packages': packages,
    children,
    ...rest
  } = props as ComponentProps<'section'> & DataProps;
  const { versions } = useContext(ChangelogFilters);
  const isFiltered = useIsFiltered(packages);

  if (isFiltered || (release && !versions.includes(release))) return null;

  if (type) {
    const { title, icon: Icon } = CHANGE_TYPES[type];
    return (
      <section
        {...rest}
        className={classes.changelogType}
        data-change-type={type}
      >
        <Heading
          level={3}
          data-size='xs'
          className={classes.changelogTypeHeading}
        >
          <Icon aria-hidden />
          {title}
        </Heading>
        {children}
      </section>
    );
  }

  return (
    <section {...rest} className={cl(release && classes.changelogRelease)}>
      {children}
    </section>
  );
}

/** A change, with the packages it was released in */
function ChangelogItem(props: unknown) {
  const {
    'data-packages': packages,
    children,
    ...rest
  } = props as ComponentProps<'li'> & DataProps;
  const isFiltered = useIsFiltered(packages);

  if (isFiltered) return null;
  if (!packages) return <li {...rest}>{children}</li>;

  const ids = packages.split(',');
  return (
    <li {...rest}>
      {children}
      <p className={classes.changelogTags}>
        <span className='ds-sr-only'>Packages: </span>
        {CHANGELOG_PACKAGES.filter(({ id }) => ids.includes(id)).map(
          ({ id, name, label, color }) => (
            <Tag key={id} data-color={color} data-size='sm' title={name}>
              {label}
            </Tag>
          ),
        )}
      </p>
    </li>
  );
}

/**
 * The version of a release, linking to that release alone. A link to the heading's id would not
 * work, as the release is only rendered on one of the pages.
 */
function ChangelogVersion(props: unknown) {
  const { 'data-version': version, id } = props as ComponentProps<'h2'> & {
    'data-version'?: string;
  };
  const { t } = useTranslation();
  if (!version) return null;

  return (
    <Heading level={2} data-size='md' id={id}>
      <RRLink
        to={{ search: new URLSearchParams({ version }).toString() }}
        aria-label={t('components.changelog.version-link', { version })}
        preventScrollReset
        className='ds-focus'
      >
        <span lang='en'>{version}</span>
      </RRLink>
    </Heading>
  );
}

function ChangelogDate(props: unknown) {
  const { dateTime } = props as ComponentProps<'time'>;
  const { lang } = useContext(ChangelogFilters);
  if (!dateTime) return null;

  return (
    <time dateTime={dateTime} lang={lang} className={classes.changelogDate}>
      {new Intl.DateTimeFormat(lang === 'no' ? 'nb-NO' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(dateTime))}
    </time>
  );
}

const changelogComponents = {
  section: ChangelogSection,
  li: ChangelogItem,
  time: ChangelogDate,
  h2: ChangelogVersion,
};

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
  const releases = parseReleases(fileContent);

  return {
    code: result.code,
    releases,
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

/** The loader only depends on the language, so filtering and paging should not fetch it again */
export const shouldRevalidate = ({
  currentParams,
  nextParams,
}: ShouldRevalidateFunctionArgs) => currentParams.lang !== nextParams.lang;

const NO_FILTERS = new URLSearchParams();
const subscribeToNothing = () => () => {};

/**
 * The filters in the URL.
 *
 * The page is prerendered without them, so they are ignored until the page has hydrated. Otherwise
 * a link with filters would not match the prerendered HTML.
 *
 * While navigating to other filters, the ones being navigated to are returned, so the page responds
 * at once instead of when the loaders of the layouts are done.
 */
function useFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const pending = useNavigation().location;
  const isHydrated = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  const pendingSearch = pending?.pathname === pathname ? pending.search : null;
  const params = useMemo(
    () =>
      pendingSearch === null
        ? searchParams
        : new URLSearchParams(pendingSearch),
    [pendingSearch, searchParams],
  );
  return [isHydrated ? params : NO_FILTERS, setSearchParams] as const;
}

export default function Changelogs({
  loaderData: { code, lang, releases },
}: Route.ComponentProps) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useFilterParams();
  const requestedVersion = searchParams.get('version') ?? '';
  const version = releases.some((item) => item.version === requestedVersion)
    ? requestedVersion
    : '';
  // No selected packages means no filter: changes in all packages are shown
  const selectedPackages = CHANGELOG_PACKAGES.map(({ id }) => id).filter((id) =>
    searchParams.getAll('package').includes(id),
  );
  const isFiltered = Boolean(version) || selectedPackages.length > 0;
  const filteredReleases = releases.filter(
    (release) =>
      (!version || release.version === version) &&
      (!selectedPackages.length ||
        release.packages.some((id) => selectedPackages.includes(id))),
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
      // usePagination keeps this callback until the page or number of pages change, so it can be
      // from a render with other filters. The URL always has the current ones.
      const next = new URLSearchParams(window.location.search);
      next.delete('page');
      if (page > 1) next.set('page', String(page));
      setSearchParams(next);
    },
  });

  function updateFilters(nextVersion: string, nextPackages: string[]) {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        next.delete('version');
        next.delete('package');
        next.delete('page');
        if (nextVersion) next.set('version', nextVersion);
        for (const id of nextPackages) next.append('package', id);
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
      {lang !== 'en' ? (
        <Alert lang='no' className={classes.textPage}>
          Endringslogger er kun tilgjengelige på engelsk
        </Alert>
      ) : null}
      <div className={cl(classes.textPage, classes.changelogFilters)}>
        <Fieldset>
          <Fieldset.Legend>
            {t('components.changelog.packages')}
          </Fieldset.Legend>
          <div className={classes.changelogChips}>
            {CHANGELOG_PACKAGES.map(({ id, name, label }) => (
              <Chip.Checkbox
                key={id}
                title={name}
                checked={selectedPackages.includes(id)}
                onChange={(event) =>
                  updateFilters(
                    version,
                    event.target.checked
                      ? [...selectedPackages, id]
                      : selectedPackages.filter((item) => item !== id),
                  )
                }
              >
                {label}
              </Chip.Checkbox>
            ))}
          </div>
        </Fieldset>
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
            {releases.map((item) => (
              <Select.Option key={item.version} value={item.version}>
                {item.version}
              </Select.Option>
            ))}
          </Select>
        </Field>
        <div className={classes.changelogStatus}>
          <Paragraph role='status' data-size='sm'>
            {t('components.changelog.results', {
              count: filteredReleases.length,
            })}
          </Paragraph>
          {isFiltered ? (
            <Button variant='tertiary' onClick={() => updateFilters('', [])}>
              {t('components.changelog.reset')}
            </Button>
          ) : null}
        </div>
      </div>
      <div
        className={cl(classes.textPage, classes.changelog, 'u-rich-text')}
        lang='en'
      >
        {filteredReleases.length === 0 ? (
          <Paragraph lang={lang}>{t('components.changelog.empty')}</Paragraph>
        ) : null}
        <ChangelogFilters
          value={{
            versions: visibleVersions,
            packages: selectedPackages.length ? selectedPackages : null,
            lang,
          }}
        >
          <MDXComponents code={code} components={changelogComponents} />
        </ChangelogFilters>
      </div>
      {totalPages > 1 ? (
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
      ) : null}
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
