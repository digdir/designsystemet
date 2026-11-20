import {
  Button,
  Chip,
  Fieldset,
  Heading,
  Pagination,
  Paragraph,
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
  type ComponentType,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  isRouteErrorResponse,
  Link as RRLink,
  type ShouldRevalidateFunctionArgs,
  useSearchParams,
} from 'react-router';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
import {
  CHANGE_TYPES,
  CHANGELOG_PACKAGES,
  type ChangeType,
  parsePackages,
} from '~/_utils/changelog';
import { getFileFromContentDir } from '~/_utils/files.server';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import { generateMetadata } from '~/_utils/metadata';
import i18nConf from '~/i18n';
import i18n from '~/i18next.server';
import type { Route } from './+types/changelog';
import classes from './changelog.module.css';

const RELEASES_PER_PAGE = 10;

const CHANGE_TYPE_ICONS = {
  major: ExclamationmarkTriangleIcon,
  minor: SparklesIcon,
  patch: PackageIcon,
} satisfies Record<ChangeType, unknown>;

/** The attributes of each `<Release>` in the MDX, see scripts/sync-changelogs.js */
const RELEASE = /^<Release ([^>]*)>$/gm;
const attribute = (attributes: string, name: string) =>
  new RegExp(`\\b${name}="([^"]*)"`).exec(attributes)?.[1];

export async function loader({ params: { lang } }: Route.LoaderArgs) {
  if (!lang || !i18nConf.supportedLngs.includes(lang)) {
    throw new Response('Not Found', { status: 404, statusText: 'Not Found' });
  }

  const fileContent = getFileFromContentDir('changelog/changelog.mdx');
  if (!fileContent) {
    throw new Response('Not Found', { status: 404, statusText: 'Not Found' });
  }

  const result = await generateFromMdx(fileContent);
  const releases = [...fileContent.matchAll(RELEASE)].map(([, attributes]) => ({
    version: attribute(attributes, 'version') ?? '',
    packages: parsePackages(attribute(attributes, 'packages')).map(
      ({ id }) => id as string,
    ),
  }));
  const t = await i18n.getFixedT(lang);

  return {
    code: result.code,
    releases,
    lang,
    metadata: {
      title: t('changelog.title'),
      description: t('changelog.description'),
    },
  };
}

export const meta = ({ loaderData, location }: Route.MetaArgs) => {
  if (!loaderData) return [{ title: 'Designsystemet' }];
  return generateMetadata({
    ...loaderData.metadata,
    pathname: location.pathname,
  });
};

/** The loader only depends on the language, so filtering and paging should not fetch it again */
export const shouldRevalidate = ({
  currentParams,
  nextParams,
}: ShouldRevalidateFunctionArgs) => currentParams.lang !== nextParams.lang;

const ChangelogFilters = createContext<{
  /** The releases on the current page */
  versions: string[];
  /** The selected version, if any */
  version: string;
  /** The packages to show changes for, or null for all */
  packages: string[] | null;
  lang: string;
}>({ versions: [], version: '', packages: null, lang: 'en' });

/** Whether none of `packages` (e.g. `cli,css`) are among the selected packages */
function useIsFiltered(packages?: string) {
  const { packages: selected } = useContext(ChangelogFilters);
  if (!selected || packages === undefined) return false;
  return !packages.split(',').some((id) => selected.includes(id));
}

function ChangelogDate({ date }: { date: string }) {
  const { lang } = useContext(ChangelogFilters);
  return (
    <time dateTime={date}>
      {new Intl.DateTimeFormat(lang === 'no' ? 'nb-NO' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(date))}
    </time>
  );
}

type ReleaseProps = {
  version: string;
  date?: string;
  figmaPublished?: string;
  packages?: string;
  children?: ReactNode;
};

/** A version, with its changes grouped by type */
function Release({
  version,
  date,
  figmaPublished,
  packages,
  children,
}: ReleaseProps) {
  const { t } = useTranslation();
  const { versions, version: selected, lang } = useContext(ChangelogFilters);
  if (!versions.includes(version)) return null;

  const name = (
    <>
      <span className='ds-sr-only' lang={lang}>
        {t('changelog.version')}{' '}
      </span>
      {version}
    </>
  );

  return (
    <section className={classes.release}>
      {/* The version and its dates stay in view while its changes are read */}
      <header className={classes.releaseHeader}>
        <div>
          <Heading
            level={2}
            data-size='sm'
            id={`v${version.replaceAll('.', '-')}`}
          >
            {/* Shows only this version, so it can be linked to */}
            {selected === version ? (
              name
            ) : (
              <RRLink
                to={{ search: new URLSearchParams({ version }).toString() }}
                preventScrollReset
              >
                {name}
              </RRLink>
            )}
          </Heading>
          {/* The dates are in the language of the page, the changes are in English */}
          {date || figmaPublished ? (
            <p className={classes.releaseDates} lang={lang}>
              {date ? (
                <span>
                  <span className={figmaPublished ? undefined : 'ds-sr-only'}>
                    {t('changelog.released')}{' '}
                  </span>
                  <ChangelogDate date={date} />
                </span>
              ) : null}
              {figmaPublished ? (
                <span>
                  {t('changelog.figma-published')}{' '}
                  <ChangelogDate date={figmaPublished} />
                </span>
              ) : null}
            </p>
          ) : null}
        </div>
      </header>
      {packages ? (
        children
      ) : (
        <Paragraph lang={lang}>{t('changelog.no-changes')}</Paragraph>
      )}
    </section>
  );
}

/** The changes of one type in a version */
function Changes({
  type,
  packages,
  children,
}: {
  type: ChangeType;
  packages?: string;
  children?: ReactNode;
}) {
  const isFiltered = useIsFiltered(packages);
  if (isFiltered) return null;
  const Icon = CHANGE_TYPE_ICONS[type];

  return (
    <section className={classes.changes} data-change-type={type}>
      <Heading level={3} data-size='xs' className={classes.changesHeading}>
        <Icon aria-hidden />
        {CHANGE_TYPES[type]}
      </Heading>
      <ul>{children}</ul>
    </section>
  );
}

/** Several changes to the same component or topic */
function ChangeGroup({
  name,
  packages,
  children,
}: {
  name: string;
  packages?: string;
  children?: ReactNode;
}) {
  const isFiltered = useIsFiltered(packages);
  if (isFiltered) return null;

  return (
    <li className={classes.changeGroup}>
      <strong>{name}</strong>
      <ul>{children}</ul>
    </li>
  );
}

/** A change, with the packages it was released in */
function Change({
  packages,
  children,
}: {
  packages?: string;
  children?: ReactNode;
}) {
  const { t } = useTranslation();
  const isFiltered = useIsFiltered(packages);
  if (isFiltered) return null;

  return (
    <li className={classes.change}>
      {children}
      {/* A list, so screen readers read the packages separately */}
      <ul className={classes.tags} aria-label={t('changelog.packages-label')}>
        {parsePackages(packages).map(({ id, label, color }) => (
          <li key={id}>
            <Tag data-color={color} data-size='sm'>
              {label}
            </Tag>
          </li>
        ))}
      </ul>
    </li>
  );
}

const changelogComponents = {
  Release,
  Changes,
  ChangeGroup,
  Change,
} as unknown as Record<string, ComponentType<unknown>>;

const NO_FILTERS = new URLSearchParams();
const subscribeToNothing = () => () => {};

/**
 * The filters in the URL, and a function to change them.
 *
 * The page is prerendered without filters, so they are ignored until the page has hydrated.
 * Otherwise a link with filters would not match the prerendered HTML.
 *
 * A change is shown at once, before the navigation to the new URL is done. Further changes build
 * on it, so quick changes in a row are not lost.
 */
function useFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isHydrated = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  const current = searchParams.toString();
  // The filters being navigated to, and the URL they were changed from. When the URL changes,
  // the navigation is done (or replaced by another one, like the back button), so they are dropped.
  const [pending, setPending] = useState<{
    params: URLSearchParams;
    from: string;
  } | null>(null);
  const params = pending?.from === current ? pending.params : searchParams;
  // usePagination keeps its callback until the page or number of pages change, so updateParams
  // can be called from an earlier render. It reads the latest filters from here.
  const latest = useRef({ params, current });
  latest.current = { params, current };

  function updateParams(change: (next: URLSearchParams) => void) {
    const next = new URLSearchParams(latest.current.params);
    change(next);
    setPending({ params: next, from: latest.current.current });
    setSearchParams(next, { preventScrollReset: true });
  }

  return {
    params: isHydrated ? params : NO_FILTERS,
    updateParams,
    isHydrated,
  };
}

export default function Changelog({
  loaderData: { code, lang, releases },
}: Route.ComponentProps) {
  const { t } = useTranslation();
  const { params, updateParams, isHydrated } = useFilterParams();
  // Focused after changing page or resetting the filters, so the reader continues from the results
  const statusRef = useRef<HTMLParagraphElement>(null);

  const requestedVersion = params.get('version') ?? '';
  const version = releases.some((item) => item.version === requestedVersion)
    ? requestedVersion
    : '';
  // No selected packages means no filter: changes in all packages are shown
  const selectedPackages: string[] = CHANGELOG_PACKAGES.map(
    ({ id }) => id,
  ).filter((id) => params.getAll('package').includes(id));
  const isFiltered = Boolean(version) || selectedPackages.length > 0;
  const filteredReleases = releases.filter(
    (release) =>
      (!version || release.version === version) &&
      (!selectedPackages.length ||
        release.packages.some((id) => selectedPackages.includes(id))),
  );

  const totalPages = Math.ceil(filteredReleases.length / RELEASES_PER_PAGE);
  const requestedPage = Number(params.get('page') ?? 1);
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

  function updateFilters(nextVersion: string, nextPackages: string[]) {
    updateParams((next) => {
      next.delete('version');
      next.delete('package');
      next.delete('page');
      if (nextVersion) next.set('version', nextVersion);
      for (const id of nextPackages) next.append('package', id);
    });
  }

  const { pages, prevButtonProps, nextButtonProps } = usePagination({
    currentPage,
    totalPages: Math.max(1, totalPages),
    showPages: 5,
    setCurrentPage: (page) => {
      updateParams((next) => {
        next.delete('page');
        if (page > 1) next.set('page', String(page));
      });
      statusRef.current?.focus();
    },
  });

  // The old changelog pages linked to versions as e.g. `#1240` for 1.24.0. Only checked once, when
  // the page has hydrated.
  useEffect(() => {
    if (!isHydrated) return;
    const hash = /^#(\d+)$/.exec(window.location.hash)?.[1];
    if (!hash) return;
    const matches = releases.filter(
      (release) => release.version.replaceAll('.', '') === hash,
    );
    // e.g. `#1110` is either 1.1.10 or 1.11.0
    if (matches.length === 1) {
      updateParams((next) => {
        next.set('version', matches[0].version);
      });
    }
  }, [isHydrated]);

  const status = [
    t('changelog.results', { count: filteredReleases.length }),
    totalPages > 1
      ? t('changelog.page-of', { page: currentPage, total: totalPages })
      : '',
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className='l-content-container' id='main'>
      <div className={classes.page}>
        <div className={classes.header}>
          <Heading data-size='lg' level={1}>
            {t('changelog.title')}
          </Heading>
          <Paragraph data-size='lg'>{t('changelog.description')}</Paragraph>
        </div>

        {/* Disabled until hydrated, as changes before that would be lost */}
        <search className={classes.filters}>
          <Fieldset>
            <Fieldset.Legend>{t('changelog.packages')}</Fieldset.Legend>
            <div className={classes.chips}>
              {CHANGELOG_PACKAGES.map(({ id, label }) => (
                <Chip.Checkbox
                  key={id}
                  name='package'
                  value={id}
                  disabled={!isHydrated}
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
                  {id === 'www' ? t('changelog.documentation') : label}
                </Chip.Checkbox>
              ))}
            </div>
          </Fieldset>
          <div className={classes.status}>
            <Paragraph
              ref={statusRef}
              role='status'
              tabIndex={-1}
              data-size='sm'
              className={classes.statusText}
            >
              {status}
            </Paragraph>
            {/* Disabled rather than removed when there is nothing to reset, so focus is not lost */}
            <Button
              variant='tertiary'
              data-size='sm'
              aria-disabled={!isFiltered || !isHydrated}
              onClick={() => {
                if (!isFiltered) return;
                updateFilters('', []);
                statusRef.current?.focus();
              }}
            >
              {t('changelog.reset')}
            </Button>
          </div>
        </search>

        {/* u-rich-text styles the content as on the other docs pages, e.g. inline code */}
        <div className={cl(classes.releases, 'u-rich-text')} lang='en'>
          {filteredReleases.length === 0 ? (
            <Paragraph lang={lang}>{t('changelog.empty')}</Paragraph>
          ) : null}
          <ChangelogFilters
            value={{
              versions: visibleVersions,
              version,
              packages: selectedPackages.length ? selectedPackages : null,
              lang,
            }}
          >
            <MDXComponents code={code} components={changelogComponents} />
          </ChangelogFilters>
        </div>

        {totalPages > 1 ? (
          <Pagination
            aria-label={t('changelog.pagination')}
            className={classes.pagination}
            data-size='sm'
          >
            <Pagination.List>
              <Pagination.Item>
                <Pagination.Button
                  {...prevButtonProps}
                  disabled={!isHydrated}
                  data-icon
                  aria-label={t('changelog.previous-page')}
                />
              </Pagination.Item>
              {pages.map(({ page, itemKey, buttonProps }) => (
                <Pagination.Item key={itemKey}>
                  {typeof page === 'number' && (
                    <Pagination.Button
                      {...buttonProps}
                      disabled={!isHydrated}
                      aria-label={t('changelog.page', { page })}
                    >
                      {page}
                    </Pagination.Button>
                  )}
                </Pagination.Item>
              ))}
              <Pagination.Item>
                <Pagination.Button
                  {...nextButtonProps}
                  disabled={!isHydrated}
                  data-icon
                  aria-label={t('changelog.next-page')}
                />
              </Pagination.Item>
            </Pagination.List>
          </Pagination>
        ) : null}
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useTranslation();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <Error404 />;
  }
  const details =
    import.meta.env.DEV && error instanceof Error
      ? error.message
      : t('errors.default.details');

  return (
    <div className='l-content-container' id='main'>
      <Heading level={1}>{t('errors.default.title')}</Heading>
      <Paragraph>{details}</Paragraph>
    </div>
  );
}
