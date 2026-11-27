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
  type RefObject,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { useTranslation } from 'react-i18next';
import {
  isRouteErrorResponse,
  Link as RRLink,
  useNavigation,
  useSearchParams,
} from 'react-router';
import { defaultComponents } from '~/_components/mdx-components/mdx-components';
import {
  CHANGE_TYPES,
  CHANGELOG_PACKAGES,
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
 * The changelog is read from app/content/changelog/changelog.json, and filtered here by the search
 * params, see getChangelogPage. Only the page without search params is prerendered; with them,
 * server.js leaves the request to React Router.
 */
export async function loader({ params: { lang }, request }: Route.LoaderArgs) {
  if (!lang || !i18nConf.supportedLngs.includes(lang)) {
    throw new Response('Not Found', { status: 404, statusText: 'Not Found' });
  }

  const changelog = await getChangelogPage(new URL(request.url).searchParams);
  if (!changelog) {
    throw new Response('Not Found', { status: 404, statusText: 'Not Found' });
  }
  const t = await i18n.getFixedT(lang);

  return {
    ...changelog,
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
  lang,
}: {
  release: ChangelogPageRelease;
  /** Whether only this version is shown */
  selected: boolean;
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
            <Change key={index} packages={packages}>
              <Markdown tree={body} />
            </Change>
          ))}
        </Changes>
      ))}
      {hasChanges ? null : (
        <Paragraph lang={lang}>{t('changelog.no-changes')}</Paragraph>
      )}
    </section>
  );
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
        {CHANGE_TYPES[type]}
      </Heading>
      <ul>{children}</ul>
    </section>
  );
}

/** A change, with the packages it was released in */
function Change({
  packages,
  children,
}: {
  packages: readonly string[];
  children?: ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <li className={classes.change}>
      {children}
      {/* A list, so screen readers read the packages separately */}
      <ul className={classes.tags} aria-label={t('changelog.packages-label')}>
        {changelogPackages(packages).map(({ id, label, color }) => (
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

/** The name of the search highlight, styled with `::highlight(changelog-search)` */
const SEARCH_HIGHLIGHT = 'changelog-search';

/**
 * Highlights the words in the changes in `container`, see highlightText. Only the text of the
 * changes, not the version, the change types or the package tags.
 */
function useSearchHighlight(
  container: RefObject<HTMLElement | null>,
  words: string[],
  /** Changes whenever the shown changes do, so the highlights are made again */
  shown: unknown,
) {
  const wordsKey = words.join(' ');
  useEffect(() => {
    if (!container.current) return;
    highlightText(wordsKey.split(' '), container.current, {
      name: SEARCH_HIGHLIGHT,
      accept: ({ parentElement }) =>
        Boolean(
          parentElement?.closest(`.${classes.change}`) &&
            !parentElement.closest(`.${classes.tags}`),
        ),
    });
    return () => clearHighlight(SEARCH_HIGHLIGHT);
  }, [wordsKey, shown]);
}

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
  // usePagination keeps its callback until the page or number of pages change, so updateParams
  // can be called from an earlier render. It reads the latest filters from here.
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

  // The chips follow the URL being navigated to, the rest follows what the loader returned
  const selectedPackages: string[] = CHANGELOG_PACKAGES.map(
    ({ id }) => id,
  ).filter((id) => params.getAll('package').includes(id));
  const words = filters.query.toLowerCase().split(/\s+/).filter(Boolean);

  /** Changes only the packages, so the version and the search are kept */
  function setPackages(nextPackages: string[]) {
    updateParams((next) => {
      next.delete('package');
      next.delete('page');
      for (const id of nextPackages) next.append('package', id);
    });
  }

  const { pages, prevButtonProps, nextButtonProps } = usePagination({
    currentPage: filters.page,
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

  // The old changelog pages linked to versions as e.g. `#1240` for 1.24.0. Hashes are not sent to
  // the server, so this is checked once the page has hydrated.
  useEffect(() => {
    if (!isHydrated) return;
    const hash = /^#(\d+)$/.exec(window.location.hash)?.[1];
    if (!hash) return;
    const matches = versions.filter(
      (version) => version.replaceAll('.', '') === hash,
    );
    // e.g. `#1110` is either 1.1.10 or 1.11.0
    if (matches.length === 1) {
      updateParams((next) => {
        next.set('version', matches[0]);
      });
    }
  }, [isHydrated]);

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

  useSearchHighlight(releasesRef, words, releases);

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
              <Suggestion.Clear></Suggestion.Clear>
            </Suggestion>
          </Field>

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
                    setPackages(
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
