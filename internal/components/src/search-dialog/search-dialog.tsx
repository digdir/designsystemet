import {
  Button,
  Chip,
  Dialog,
  Heading,
  Link,
  Paragraph,
  Search,
  Skeleton,
  Tag,
} from '@digdir/designsystemet-react';
import {
  ChevronDownIcon,
  FileSearchIcon,
  RobotSmileIcon,
} from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import type { CSSProperties } from 'react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounceCallback } from '../_hooks/use-debounce-callback/use-debounce-callback';
import { MDXComponents } from '../mdx-components/mdx-components';
import classes from './search-dialog.module.css';

type SearchDialogProps = {
  open: boolean;
  onClose: () => void;
  onSearch?: (query: string) => Promise<{
    success: boolean;
    results: QuickResult[];
    query: string;
    error?: string;
  }>;
  onAiSearch?: (query: string) => Promise<{
    success: boolean;
    result: SmartResult;
    query: string;
    error?: string;
  }>;
};

type QuickResult = {
  title: string;
  content: string;
  url: string;
  type: 'component' | 'guide' | 'pattern' | 'blog';
  sources?: { title: string; url: string }[];
};

type SmartResult = {
  content: string;
  sources: { title: string; url: string }[];
};

const Star = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    aria-hidden='true'
    viewBox='0 0 96 96'
  >
    <path d='M93.8 51.6A4 4 0 0 0 96 48c0-1.4-1-3-2.2-3.6 0 0-22.9-1.5-31.8-10.4S51.6 2.2 51.6 2.2C51 1 49.4 0 48 0s-3 1-3.6 2.2c0 0-1.5 22.9-10.4 31.8S2.2 44.4 2.2 44.4A4 4 0 0 0 0 48c0 1.4 1 3 2.2 3.6 0 0 22.9 1.5 31.8 10.4s10.4 31.8 10.4 31.8C45 95 46.6 96 48 96s3-1 3.6-2.2c0 0 1.5-22.9 10.4-31.8s31.8-10.4 31.8-10.4' />
  </svg>
);

export const SearchDialog = ({
  open,
  onClose,
  onSearch,
  onAiSearch,
}: SearchDialogProps) => {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const [quickResults, setQuickResults] = useState<QuickResult[]>([]);
  const [smartResult, setSmartResult] = useState<SmartResult | null>(null);
  const [isQuickLoading, setIsQuickLoading] = useState(false);
  const [isSmartLoading, setIsSmartLoading] = useState(false);
  const [smartExpanded, setSmartExpanded] = useState(false);
  const [visibleQuickCount, setVisibleQuickCount] = useState(8);
  const latestQueryRef = useRef<string>('');

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setQuickResults([]);
      setSmartResult(null);
      setIsQuickLoading(false);
      setIsSmartLoading(false);
      return;
    }

    latestQueryRef.current = searchQuery;
    const isSingleWord = searchQuery.trim().split(/\s+/).length === 1;
    setVisibleQuickCount(8);
    setSmartExpanded(false);
    setSmartResult(null);

    if (isSingleWord) {
      // Quick only
      setIsSmartLoading(false);
      await handleSearch(searchQuery);
      return;
    }

    try {
      const results = await Promise.allSettled([
        handleSearch(searchQuery),
        handleAiSearch(searchQuery),
      ]);

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(
            `Search error (parallel, index ${index}):`,
            result.reason,
          );
        }
      });
    } catch (e) {
      console.error('Search error (parallel):', e);
    }
  };

  const debouncedCallback = useDebounceCallback((value: string) => {
    performSearch(value);
  }, 1000);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedCallback(value);
  };

  const handleClear = () => {
    setQuery('');
    setQuickResults([]);
    setSmartResult(null);
    setIsQuickLoading(false);
    setIsSmartLoading(false);
  };

  const handleClose = () => {
    setQuery('');
    setQuickResults([]);
    setSmartResult(null);
    setIsQuickLoading(false);
    setIsSmartLoading(false);
    onClose();
  };

  const handleSearch = async (searchQuery: string) => {
    if (!onSearch) return Promise.resolve();
    setIsQuickLoading(true);
    return onSearch(searchQuery)
      .then((response) => {
        if (response.success) {
          const data = response.results;
          if (latestQueryRef.current === searchQuery) {
            setQuickResults(data || []);
          }
        } else {
          if (latestQueryRef.current === searchQuery) setQuickResults([]);
        }
      })
      .catch((error) => {
        console.warn('Search (quick):', error);
        if (latestQueryRef.current === searchQuery) setQuickResults([]);
      })
      .finally(() => {
        if (latestQueryRef.current === searchQuery) setIsQuickLoading(false);
      });
  };

  const handleAiSearch = async (searchQuery: string) => {
    if (!onAiSearch) return Promise.resolve();
    setIsSmartLoading(true);
    return onAiSearch(searchQuery)
      .then((response) => {
        console.log('AI Search response: ', response);
        if (response.success) {
          const data = response.result;
          if (latestQueryRef.current === searchQuery) {
            setSmartResult(data || null);
          }
        } else {
          if (latestQueryRef.current === searchQuery) setSmartResult(null);
        }
      })
      .catch((error) => {
        console.warn('Search (smart):', error);
        if (latestQueryRef.current === searchQuery) setSmartResult(null);
      })
      .finally(() => {
        if (latestQueryRef.current === searchQuery) setIsSmartLoading(false);
      });
  };

  return (
    <Dialog
      ref={dialogRef}
      closedby='any'
      open={open}
      onClose={handleClose}
      className={classes.dialog}
    >
      <div className={classes.aboveScroll}>
        <Dialog.Block className={classes.searchBlock}>
          <Heading data-size='xs' className={classes.title}>
            {t('search.title', 'Hva leter du etter eller lurer på?')}
          </Heading>
          <Search className={classes.search}>
            <Search.Input
              aria-label={t(
                'search.input-label',
                'Søk etter komponenter, retningslinjer og mer...',
              )}
              placeholder={t(
                'search.placeholder',
                'Søk etter komponenter, retningslinjer og mer...',
              )}
              value={query}
              onChange={handleInputChange}
              autoFocus
            />
            <Search.Clear onClick={handleClear} />
          </Search>
        </Dialog.Block>
      </div>

      <div className={classes.resultsContainer}>
        {query && (
          <div className={classes.results}>
            {/* Smart answer section (only for 2+ words) */}
            {query.trim().split(/\s+/).length > 1 && (
              <section
                aria-live='polite'
                aria-busy={isSmartLoading}
                className={classes.resultsBlock}
                style={{ borderBottom: 'var(--this-border)' }}
              >
                {isSmartLoading ? (
                  <div className={classes.smartSkeletonLines}>
                    <Heading>
                      <Skeleton variant='text' width={10} />
                    </Heading>
                    <Paragraph>
                      <Skeleton variant='text' width={75} />
                    </Paragraph>
                    <Paragraph>
                      <Skeleton variant='text' width={50} />
                    </Paragraph>
                    <Paragraph>
                      <Skeleton variant='text' width={36} />
                    </Paragraph>
                    <Paragraph>
                      <Skeleton variant='text' width={25} />
                    </Paragraph>
                    <Heading style={{ marginTop: '32px' }}>
                      <Skeleton variant='text' width={20} />
                    </Heading>
                    <Paragraph>
                      <Skeleton variant='text' width={55} />
                    </Paragraph>
                  </div>
                ) : smartResult?.content ? (
                  <>
                    <Heading className={classes.iconHeading} data-size='xs'>
                      <RobotSmileIcon /> KI-Oversikt{' '}
                      <span className={classes.sparkles}>
                        <Star />
                        <Star />
                        <Star />
                      </span>
                    </Heading>
                    <div
                      className={cl(
                        'u-rich-text',
                        classes.smartContent,
                        !smartExpanded && classes.smartCollapsed,
                      )}
                    >
                      <MDXComponents code={smartResult.content} />
                    </div>
                    <Button
                      variant='secondary'
                      data-size='sm'
                      onClick={() => setSmartExpanded((v) => !v)}
                      className={classes.smartToggle}
                    >
                      {smartExpanded ? (
                        <>
                          {t('search.show-less', 'Vis mindre')}
                          <ChevronDownIcon
                            aria-hidden
                            style={{ rotate: '180deg' }}
                          />
                        </>
                      ) : (
                        <>
                          {t('search.show-more', 'Vis mer')}{' '}
                          <ChevronDownIcon aria-hidden />
                        </>
                      )}
                    </Button>

                    {smartExpanded && smartResult.sources?.length > 0 && (
                      <nav
                        aria-label={t('search.sources', 'Kilder')}
                        className={classes.sources}
                      >
                        <Heading
                          data-size='2xs'
                          className={classes.sourcesTitle}
                        >
                          {t('search.sources', 'Kilder')}
                        </Heading>
                        <ul className={classes.sourcesList}>
                          {smartResult.sources.map((source, idx) => (
                            <li key={idx} className={classes.sourceItem}>
                              <a
                                href={source.url}
                                onClick={handleClose}
                                className={classes.sourceLink}
                              >
                                {source.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    )}
                  </>
                ) : null}
              </section>
            )}

            {/* Quick results */}
            {isQuickLoading && quickResults.length === 0 && (
              <section className={classes.resultsBlock}>
                <div className={classes.quickResult}>
                  <Skeleton variant='text' width={30} />
                  <Skeleton variant='rectangle' height={80} />
                </div>
                <div className={classes.quickResult}>
                  <Skeleton variant='text' width={40} />
                  <Skeleton variant='rectangle' height={80} />
                </div>
              </section>
            )}
            {quickResults.length > 0 && (
              <section className={classes.resultsBlock}>
                <Heading className={classes.iconHeading} data-size='xs'>
                  <FileSearchIcon /> Søkeresultater
                </Heading>
                {quickResults
                  .slice(0, visibleQuickCount)
                  .map((result, index) => (
                    <div
                      key={index}
                      style={{ '--i': `${index}` } as CSSProperties}
                      className={classes.quickResult}
                    >
                      <div className={classes.resultHeader}>
                        <h3 className={classes.resultTitle}>
                          <Link
                            href={result.url}
                            className={classes.quickResultLink}
                            onClick={handleClose}
                          >
                            {result.title}
                          </Link>
                        </h3>
                        <Tag
                          data-size='sm'
                          data-color={
                            result.type === 'component'
                              ? 'brand1'
                              : result.type === 'guide'
                                ? 'brand2'
                                : result.type === 'pattern'
                                  ? 'brand3'
                                  : 'neutral'
                          }
                        >
                          {result.type}
                        </Tag>
                      </div>
                      <Paragraph className={classes.quickResultContent}>
                        {result.content}
                      </Paragraph>
                      <Paragraph
                        className={classes.quickResultUrl}
                        data-size='xs'
                      >
                        {result.url}
                      </Paragraph>
                    </div>
                  ))}
                {quickResults.length > visibleQuickCount && (
                  <div>
                    <Button
                      variant='secondary'
                      data-size='sm'
                      onClick={() =>
                        setVisibleQuickCount((c) =>
                          Math.min(c + 8, quickResults.length),
                        )
                      }
                    >
                      {t('search.show-more-results', 'Vis flere resultater')}
                    </Button>
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {!query && (
          <div className={classes.resultsBlock}>
            <Paragraph className={classes.suggestionsTitle}>
              {t('search.suggestions-title', 'Prøv å søke etter...')}
            </Paragraph>
            <div className={classes.suggestionsList}>
              <Chip.Button
                onClick={() => {
                  setQuery('Button component');
                  performSearch('Button component');
                }}
              >
                Button component
              </Chip.Button>

              <Chip.Button
                onClick={() => {
                  setQuery('Design tokens');
                  performSearch('Design tokens');
                }}
              >
                Design tokens
              </Chip.Button>

              <Chip.Button
                onClick={() => {
                  setQuery('Accessibility guidelines');
                  performSearch('Accessibility guidelines');
                }}
              >
                Accessibility guidelines
              </Chip.Button>
              <Chip.Button
                onClick={() => {
                  setQuery('Hvordan legger jeg til scroll i dropdown?');
                  performSearch('Hvordan legger jeg til scroll i dropdown?');
                }}
              >
                Hvordan legger jeg til scroll i dropdown?
              </Chip.Button>
            </div>
          </div>
        )}

        {query &&
          !isQuickLoading &&
          !isSmartLoading &&
          quickResults.length === 0 &&
          !smartResult && (
            <div className={classes.noResults}>
              {t('search.no-results', 'Ingen resultat for')} "{query}"
            </div>
          )}
      </div>
    </Dialog>
  );
};
