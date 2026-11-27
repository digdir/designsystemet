import {
  Button,
  Chip,
  Field,
  Fieldset,
  Heading,
  Input,
  Label,
  Pagination,
  Paragraph,
  EXPERIMENTAL_Suggestion as Suggestion,
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
import type { Root as HastRoot } from 'hast';
import { type Components, toJsxRuntime } from 'hast-util-to-jsx-runtime';
import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { useTranslation } from 'react-i18next';
import {
  isRouteErrorResponse,
  useNavigation,
  useSearchParams,
} from 'react-router';
import { RRLink } from '~/_components/link';
import { defaultComponents } from '~/_components/mdx-components/mdx-components';
import {
  CHANGE_HEADINGS,
  CHANGELOG_PACKAGES,
  type ChangelogPackage,
  type ChangeType,
  changelogPackages,
} from '~/_utils/changelog';
import {
  type ChangelogPageRelease,
  getChangelogPage,
} from '~/_utils/changelog.server';
import { clearHighlight, highlightText } from '~/_utils/highlight';
import { generateMetadata } from '~/_utils/metadata';
import i18nConf from '~/i18n';
import i18n from '~/i18next.server';
import type { Route } from './+types/changelog';
import classes from './changelog.module.css';

const CHANGE_TYPE_ICONS = {
  major: ExclamationmarkTriangleIcon,
  minor: SparklesIcon,
  patch: PackageIcon,
} satisfies Record<ChangeType, unknown>;

/**
 * The changelog is read from changelog.json at the root of the repo, and filtered here by the search
 * params, see getChangelogPage. Only the page without search params is prerendered; with them,
 * server.js leaves the request to React Router. So it does for the markdown version of the page,
 * e.g. /en/changelog.md, which has every version on one page, as it has no pagination.
 */
export async function loader({ params: { lang }, request }: Route.LoaderArgs) {
  if (!lang || !i18nConf.supportedLngs.includes(lang)) {
    throw new Response('Not Found', { status: 404, statusText: 'Not Found' });
  }

  const changelog = await getChangelogPage(new URL(request.url).searchParams, {
    // Set by server/markdown-negotiation.js
    allPages: request.headers.get('accept') === 'text/markdown',
  });
  const t = await i18n.getFixedT(lang);

  return {
    ...changelog,
    lang,
    metadata: {
      // A link to one version is told apart from the changelog, e.g. in a tab or where it is shared
      title:
        changelog.filters.version && changelog.total > 0
          ? `${t('changelog.title')} ${changelog.filters.version}`
          : t('changelog.title'),
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

const markdownComponents = defaultComponents as unknown as Components;

/** Markdown rendered on the server, see getChangelogPage */
function Markdown({ tree }: { tree: HastRoot }) {
  return toJsxRuntime(tree, {
    Fragment,
    jsx,
    jsxs,
    components: markdownComponents,
  });
}

function ChangelogDate({ date, lang }: { date: string; lang: string }) {
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

/** A version, with its notes and its changes grouped by type */
function Release({
  release: { version, date, figmaPublished, notes, hasChanges, groups },
  selected,
  onSelect,
  lang,
}: {
  release: ChangelogPageRelease;
  /** Whether only this version is shown */
  selected: boolean;
  /** Called when the link to show only this version is followed */
  onSelect: () => void;
  lang: string;
}) {
  const { t } = useTranslation();

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
            {selected ? (
              name
            ) : (
              <RRLink
                to={{ search: new URLSearchParams({ version }).toString() }}
                preventScrollReset
                onClick={onSelect}
                data-color='neutral'
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
                  {t('changelog.released')}{' '}
                  <ChangelogDate date={date} lang={lang} />
                </span>
              ) : null}
              {/* The dot between the dates is only drawn, so their text is kept apart by this */}
              {date && figmaPublished ? ' ' : null}
              {figmaPublished ? (
                <span>
                  {t('changelog.figma-published')}{' '}
                  <ChangelogDate date={figmaPublished} lang={lang} />
                </span>
              ) : null}
            </p>
          ) : null}
        </div>
      </header>
      {/* Also a version without changes can have notes */}
      {notes ? (
        <div className={classes.releaseNotes}>
          <Markdown tree={notes} />
        </div>
      ) : null}
      {groups.map(({ type, changes }) => (
        <Changes key={type} type={type}>
          {changes.map(({ packages, body }, index) => (
            <Change key={index} packages={packages} lang={lang}>
              <Markdown tree={body} />
            </Change>
          ))}
        </Changes>
      ))}
      {groups.length > 0 ? null : (
        <Paragraph lang={lang}>
          {t(
            hasChanges
              ? 'changelog.no-changes-in-packages'
              : 'changelog.no-changes',
          )}
        </Paragraph>
      )}
    </section>
  );
}

/** The label of a package, in the language of the page */
function usePackageLabel() {
  const { t } = useTranslation();
  return ({ id, label }: ChangelogPackage) =>
    id === 'www' ? t('changelog.documentation') : label;
}

/** The changes of one type in a version */
function Changes({
  type,
  children,
}: {
  type: ChangeType;
  children?: ReactNode;
}) {
  const Icon = CHANGE_TYPE_ICONS[type];

  return (
    <section className={classes.changes} data-change-type={type}>
      <Heading level={3} data-size='xs' className={classes.changesHeading}>
        <Icon aria-hidden />
        {CHANGE_HEADINGS[type]}
      </Heading>
      <ul>{children}</ul>
    </section>
  );
}

/** A change, with the packages it was released in */
function Change({
  packages,
  lang,
  children,
}: {
  packages: readonly string[];
  /** The language of the page, which the names of the packages are in */
  lang: string;
  children?: ReactNode;
}) {
  const { t } = useTranslation();
  const packageLabel = usePackageLabel();

  return (
    <li className={classes.change}>
      {children}
      {/* As text, so it is also in the markdown version of the page */}
      <p className='ds-sr-only' lang={lang}>
        {t('changelog.packages-label')}
      </p>
      {/* A list, so screen readers read the packages separately */}
      <ul className={classes.tags} lang={lang}>
        {changelogPackages(packages).map((pkg) => (
          <li key={pkg.id}>
            <Tag data-color={pkg.color} data-size='sm'>
              {packageLabel(pkg)}
            </Tag>
          </li>
        ))}
      </ul>
    </li>
  );
}

/** The name of the search highlight, styled with `::highlight(changelog-search)` */
const SEARCH_HIGHLIGHT = 'changelog-search';

const subscribeToNothing = () => () => {};

/**
 * The filters in the URL, and a function to change them. The loader filters the changelog by them.
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
  // Dropped once the URL has changed, so they are not used again when the URL goes back to the
  // one they were changed from, e.g. with the back button
  useEffect(() => {
    setPending((value) => (value && value.from !== current ? null : value));
  }, [current]);
  // updateParams can be called from an earlier render, e.g. when typing in the search field
  // stops. It reads the latest filters from here.
  const latest = useRef({ params, current });
  latest.current = { params, current };

  function updateParams(
    change: (next: URLSearchParams) => void,
    { replace = false } = {},
  ) {
    const next = new URLSearchParams(latest.current.params);
    change(next);
    setPending({ params: next, from: latest.current.current });
    setSearchParams(next, { preventScrollReset: true, replace });
  }

  return { params, updateParams, isHydrated };
}

export default function Changelog({ loaderData }: Route.ComponentProps) {
  const { lang, releases, versions, filters, total, matchCount, totalPages } =
    loaderData;
  const { t } = useTranslation();
  const { params, updateParams, isHydrated } = useFilterParams();
  const navigation = useNavigation();
  // Focused after changing page or resetting the filters, so the reader continues from the results
  const statusRef = useRef<HTMLParagraphElement>(null);
  const releasesRef = useRef<HTMLDivElement>(null);
  const packageLabel = usePackageLabel();

  // The chips follow the URL being navigated to, the rest follows what the loader returned
  const selectedPackages = params.getAll('package');

  /** Changes only this package, so the version, the search and the other packages are kept */
  function setPackage(id: string, checked: boolean) {
    updateParams((next) => {
      const others = next.getAll('package').filter((item) => item !== id);
      next.delete('package');
      next.delete('page');
      for (const item of checked ? [...others, id] : others)
        next.append('package', item);
    });
  }

  const { pages, prevButtonProps, nextButtonProps } = usePagination({
    currentPage: filters.page,
    totalPages,
    showPages: 5,
    // The pages are links, see pageLink, so only the focus is moved here
    setCurrentPage: () => statusRef.current?.focus(),
  });

  /**
   * The link to a page with the filters kept. The pages are links, so they also work before the
   * page has loaded and for crawlers, which only get the newest versions in the prerendered page.
   */
  const pageLink = (page: number, children?: ReactNode) => {
    const search = new URLSearchParams(params);
    search.delete('page');
    if (page > 1) search.set('page', String(page));
    return (
      <RRLink to={{ search: search.toString() }} preventScrollReset>
        {children}
      </RRLink>
    );
  };

  // The old changelog pages linked to versions as e.g. `#1240` for 1.24.0. Hashes are not sent to
  // the server, so this is checked once the page has hydrated.
  useEffect(() => {
    const [, digits, repeat = 0] =
      /^#(\d+)(?:-(\d+))?$/.exec(window.location.hash) ?? [];
    if (!digits) return;
    // Versions with the same digits were numbered from the newest: `#1110` was 1.11.0 and
    // `#1110-1` was 1.1.10
    const version = versions.filter(
      (version) => version.replaceAll('.', '') === digits,
    )[Number(repeat)];
    if (version) {
      // Replaced, so going back leaves the page instead of showing every version
      updateParams(
        (next) => {
          next.set('version', version);
        },
        { replace: true },
      );
    }
  }, []);

  // What is typed in the search field. The URL is updated when typing stops, so the list and the
  // count of results (which screen readers announce) do not change on every key.
  const query = params.get('q')?.trim() ?? '';
  const [searchInput, setSearchInput] = useState(query);
  const sentQuery = useRef(query);
  // The search in the URL changed in another way, e.g. reset or the back button
  useEffect(() => {
    if (query === sentQuery.current) return;
    sentQuery.current = query;
    setSearchInput(query);
  }, [query]);
  useEffect(() => {
    const next = searchInput.trim();
    if (next === sentQuery.current) return;
    const timer = setTimeout(() => {
      sentQuery.current = next;
      updateParams(
        (params) => {
          params.delete('page');
          if (next) params.set('q', next);
          else params.delete('q');
        },
        { replace: true },
      );
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Highlights the words searched for in the text of the changes, not in the versions, the change
  // types or the package tags. Made again whenever the shown changes do.
  useEffect(() => {
    if (!releasesRef.current) return;
    highlightText(filters.query.split(/\s+/), releasesRef.current, {
      name: SEARCH_HIGHLIGHT,
      accept: ({ parentElement }) =>
        Boolean(
          parentElement?.closest(`.${classes.change}`) &&
            !parentElement.closest(`.${classes.tags}`),
        ),
    });
    return () => clearHighlight(SEARCH_HIGHLIGHT);
  }, [releases, filters.query]);

  // From the URL being navigated to and what is typed, like the chips, so the reset button shows
  // and hides at once
  const hasFilters =
    params.has('version') ||
    selectedPackages.length > 0 ||
    searchInput.trim() !== '';

  const status = [
    matchCount !== null ? t('changelog.matches', { count: matchCount }) : '',
    t('changelog.results', { count: total }),
    totalPages > 1
      ? t('changelog.page-of', { page: filters.page, total: totalPages })
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
          {/* The label is a direct child of Field, which spaces it from the field and links them */}
          <Field className={classes.search}>
            <Label>{t('changelog.search')}</Label>
            <Suggestion>
              <Input
                type='search'
                value={searchInput}
                disabled={!isHydrated}
                onChange={(event) => setSearchInput(event.target.value)}
              />
              <Suggestion.Clear />
            </Suggestion>
          </Field>

          <Fieldset>
            <Fieldset.Legend>{t('changelog.packages')}</Fieldset.Legend>
            <div className={classes.chips}>
              {CHANGELOG_PACKAGES.map((pkg) => (
                <Chip.Checkbox
                  key={pkg.id}
                  name='package'
                  value={pkg.id}
                  disabled={!isHydrated}
                  checked={selectedPackages.includes(pkg.id)}
                  onChange={(event) => setPackage(pkg.id, event.target.checked)}
                >
                  {packageLabel(pkg)}
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
            >
              {status}
            </Paragraph>
            {/* Only when there is something to reset. Focus moves to the status when it is used, so
             * it is not lost when the button goes away. */}
            {hasFilters ? (
              <Button
                variant='tertiary'
                data-size='sm'
                aria-disabled={!isHydrated}
                onClick={() => {
                  updateParams((next) => {
                    for (const key of ['version', 'package', 'q', 'page'])
                      next.delete(key);
                  });
                  // Already cleared in the URL, so typing stops is not waited for
                  sentQuery.current = '';
                  setSearchInput('');
                  statusRef.current?.focus();
                }}
              >
                {t('changelog.reset')}
              </Button>
            ) : null}
          </div>
        </search>

        {/* u-rich-text styles the content as on the other docs pages, e.g. inline code */}
        <div
          ref={releasesRef}
          className={cl(classes.releases, 'u-rich-text')}
          lang='en'
          aria-busy={navigation.state === 'loading' || undefined}
        >
          {releases.length === 0 ? (
            <Paragraph lang={lang}>{t('changelog.empty')}</Paragraph>
          ) : null}
          {releases.map((release) => (
            <Release
              key={release.version}
              release={release}
              selected={filters.version === release.version}
              // The list becomes one version, so the reader continues from the top of it
              onSelect={() => statusRef.current?.focus()}
              lang={lang}
            />
          ))}
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
                  asChild
                  data-icon
                  aria-label={t('changelog.previous-page')}
                >
                  {pageLink(filters.page - 1)}
                </Pagination.Button>
              </Pagination.Item>
              {pages.map(({ page, itemKey, buttonProps }) => (
                // TODO update with new pagination() from #5581 after v2 release
                <Pagination.Item key={itemKey}>
                  {typeof page === 'number' && (
                    <Pagination.Button
                      {...buttonProps}
                      asChild
                      aria-label={t('changelog.page', { page })}
                    >
                      {pageLink(page, page)}
                    </Pagination.Button>
                  )}
                </Pagination.Item>
              ))}
              <Pagination.Item>
                <Pagination.Button
                  {...nextButtonProps}
                  asChild
                  data-icon
                  aria-label={t('changelog.next-page')}
                >
                  {pageLink(filters.page + 1)}
                </Pagination.Button>
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
