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
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounceCallback } from '../_hooks/use-debounce-callback/use-debounce-callback';
import classes from './search-dialog.module.css';

// Helper for safely accessing CSS Module classes that may not yet be in the generated .d.ts
const cx = (key: string) => (classes as Record<string, string>)[key] ?? '';

type SearchDialogProps = {
  open: boolean;
  onClose: () => void;
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

// Basic, safe markdown renderer: supports headings (#/##/###), unordered lists (-/* ),
// bold (**text**), italics (*text* or _text_), and inline code (`code`). Links [text](url) are supported.
const parseMarkdown = (text: string): React.ReactNode => {
  const inline = (input: string, keyPrefix: string) => {
    // Render links [text](url)
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    const segments: React.ReactNode[] = [];
    let lastIndex = 0;
    let segIndex = 0;
    const matches = Array.from(input.matchAll(linkPattern));
    for (const m of matches) {
      const [full, label, href] = m;
      const idx = m.index ?? 0;
      if (idx > lastIndex) {
        segments.push(input.slice(lastIndex, idx));
      }
      segments.push(
        <a key={`${keyPrefix}-link-${segIndex++}`} href={href}>
          {label}
        </a>,
      );
      lastIndex = idx + full.length;
    }
    if (lastIndex < input.length) segments.push(input.slice(lastIndex));

    // Now process bold/italic/code on each plain string segment
    const processInline = (
      node: React.ReactNode,
      idx: number,
    ): React.ReactNode => {
      if (typeof node !== 'string') return node;
      const tokenPattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|_[^_]+_)/g;
      const parts = node.split(tokenPattern);
      return parts.map((part, i) => {
        if (/^\*\*.*\*\*$/.test(part)) {
          return (
            <strong key={`${keyPrefix}-b-${idx}-${i}`}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (/^`.*`$/.test(part)) {
          return (
            <code key={`${keyPrefix}-c-${idx}-${i}`}>{part.slice(1, -1)}</code>
          );
        }
        if (/^(\*.*\*|_.*_)$/.test(part)) {
          return (
            <em key={`${keyPrefix}-i-${idx}-${i}`}>{part.slice(1, -1)}</em>
          );
        }
        return part;
      });
    };

    return segments.flatMap(processInline);
  };

  const lines = text.split(/\r?\n/);
  const result: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listBuffer.length) {
      result.push(
        <ul key={`ul-${key++}`}>
          {listBuffer.map((item, i) => (
            <li key={`li-${key}-${i}`}>{inline(item, `li-${key}-${i}`)}</li>
          ))}
        </ul>,
      );
      listBuffer = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      result.push(<br key={`br-${key++}`} />);
      continue;
    }

    // Headings
    const hMatch = /^(#{1,3})\s+(.*)$/.exec(trimmed);
    if (hMatch) {
      flushList();
      const level = hMatch[1].length; // 1-3
      const content = hMatch[2];
      const size: 'sm' | 'xs' | '2xs' =
        level === 1 ? 'sm' : level === 2 ? 'xs' : '2xs';
      result.push(
        <Heading key={`h-${key++}`} data-size={size}>
          {inline(content, `h-${key}`)}
        </Heading>,
      );
      continue;
    }

    // Unordered list items
    if (/^[-*]\s+/.test(trimmed)) {
      listBuffer.push(trimmed.replace(/^[-*]\s+/, ''));
      continue;
    }

    // Paragraph
    flushList();
    result.push(<p key={`p-${key++}`}>{inline(trimmed, `p-${key}`)}</p>);
  }

  flushList();
  return result;
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

export const SearchDialog = ({ open, onClose }: SearchDialogProps) => {
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

  // Handle dialog open/close with ref
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  // Handle search
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

    if (isSingleWord) {
      // Quick only
      setSmartResult(null);
      setIsSmartLoading(false);
      setIsQuickLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/api/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery }),
        });
        if (response.ok) {
          const data = await response.json();
          if (latestQueryRef.current === searchQuery) {
            setQuickResults(data.results || []);
          }
        } else {
          if (latestQueryRef.current === searchQuery) setQuickResults([]);
        }
      } catch (error) {
        console.error('Search error (quick):', error);
        if (latestQueryRef.current === searchQuery) setQuickResults([]);
      } finally {
        if (latestQueryRef.current === searchQuery) setIsQuickLoading(false);
      }
      return;
    }

    // Two or more words: run both in parallel
    setIsQuickLoading(true);
    setIsSmartLoading(true);
    setSmartResult(null);
    try {
      const quickPromise = fetch(`http://localhost:3001/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      })
        .then((res) => (res.ok ? res.json() : Promise.resolve({ results: [] })))
        .then((data) => {
          if (latestQueryRef.current === searchQuery) {
            setQuickResults(data.results || []);
          }
        })
        .catch((err) => {
          console.error('Search error (quick):', err);
          if (latestQueryRef.current === searchQuery) setQuickResults([]);
        })
        .finally(() => {
          if (latestQueryRef.current === searchQuery) setIsQuickLoading(false);
        });

      const smartPromise = fetch(`http://localhost:3001/api/ai-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      })
        .then((res) =>
          res.ok ? res.json() : Promise.resolve({ answer: '', sources: [] }),
        )
        .then((data) => {
          if (latestQueryRef.current === searchQuery) {
            setSmartResult({
              content: data.answer || '',
              sources: data.sources || [],
            });
          }
        })
        .catch((err) => {
          console.error('Search error (smart):', err);
          if (latestQueryRef.current === searchQuery) setSmartResult(null);
        })
        .finally(() => {
          if (latestQueryRef.current === searchQuery) setIsSmartLoading(false);
        });

      await Promise.allSettled([quickPromise, smartPromise]);
    } catch (e) {
      console.error('Search error (parallel):', e);
      if (latestQueryRef.current === searchQuery) {
        setIsQuickLoading(false);
        setIsSmartLoading(false);
      }
    }
  };
  const debouncedCallback = useDebounceCallback((value: string) => {
    performSearch(value);
  }, 400);
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

  return (
    <Dialog
      ref={dialogRef}
      closedby='any'
      onClose={handleClose}
      className={cl(classes.dialog)}
    >
      <div className={classes.sticky}>
        <Dialog.Block>
          <Heading data-size='xs' className={cl(classes.title)}>
            {t('search.title', 'Hva leter du etter eller lurer på?')}
          </Heading>
        </Dialog.Block>

        <Dialog.Block className={cl(classes.searchBlock)}>
          <Search className={cl(classes.search)}>
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

      <Dialog.Block className={cl(classes.resultsContainer)}>
        {query && (
          <div className={cl(classes.results)}>
            {/* Smart answer section (only for 2+ words) */}
            {query.trim().split(/\s+/).length > 1 && (
              <section
                aria-live='polite'
                aria-busy={isSmartLoading}
                className={cl(classes.resultsBlock)}
                style={{ borderBottom: 'var(--this-border)' }}
              >
                {isSmartLoading ? (
                  <div
                    className={cl(cx('smartBox'))}
                    style={{ minHeight: 275 }}
                  >
                    <div className={cl(cx('smartSkeletonLines'))}>
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
                  </div>
                ) : smartResult?.content ? (
                  <div className={cl(cx('smartBox'))}>
                    <Heading className={cl(classes.iconHeading)} data-size='xs'>
                      <RobotSmileIcon /> KI-Oversikt{' '}
                      <span className={cl(classes.sparkles)}>
                        <Star />
                        <Star />
                        <Star />
                      </span>
                    </Heading>
                    <div
                      className={cl(
                        cx('smartContent'),
                        !smartExpanded && cx('smartCollapsed'),
                      )}
                    >
                      {parseMarkdown(smartResult.content)}
                    </div>
                    <Button
                      variant='secondary'
                      data-size='sm'
                      onClick={() => setSmartExpanded((v) => !v)}
                      className={cl(cx('smartToggle'))}
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
                        className={cl(classes.sources)}
                      >
                        <Heading
                          data-size='2xs'
                          className={cl(classes.sourcesTitle)}
                        >
                          {t('search.sources', 'Kilder')}
                        </Heading>
                        <ul className={cl(cx('sourcesList'))}>
                          {smartResult.sources.map((source, idx) => (
                            <li key={idx} className={cl(cx('sourceItem'))}>
                              <a
                                href={source.url}
                                onClick={handleClose}
                                className={cl(classes.sourceLink)}
                              >
                                {source.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    )}
                  </div>
                ) : null}
              </section>
            )}

            {/* Quick results */}
            {quickResults.length > 0 && (
              <section className={cl(classes.resultsBlock)}>
                <Heading
                  style={{ marginBottom: 'var(--ds-size-6)' }}
                  className={cl(classes.iconHeading)}
                  data-size='xs'
                >
                  <FileSearchIcon /> Søkeresultater
                </Heading>
                {quickResults
                  .slice(0, visibleQuickCount)
                  .map((result, index) => (
                    <div
                      key={index}
                      style={{ '--i': `${index}` } as CSSProperties}
                      className={cl(classes.quickResult)}
                    >
                      <div className={cl(classes.resultHeader)}>
                        <h3 className={cl(classes.resultTitle)}>
                          <Link
                            href={result.url}
                            className={cl(classes.quickResultLink)}
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
                      <Paragraph className={cl(classes.quickResultContent)}>
                        {result.content}
                      </Paragraph>
                      <Paragraph
                        className={cl(classes.quickResultUrl)}
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
          <div className={cl(classes.suggestions, classes.resultsBlock)}>
            <Paragraph>
              {t('search.suggestions-title', 'Prøv å søke etter...')}
            </Paragraph>
            <div className={cl(classes.suggestionsList)}>
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
            </div>
          </div>
        )}

        {query &&
          !isQuickLoading &&
          !isSmartLoading &&
          quickResults.length === 0 &&
          !smartResult && (
            <div className={cl(classes.noResults)}>
              {t('search.no-results', 'Ingen resultat for')} "{query}"
            </div>
          )}
      </Dialog.Block>
    </Dialog>
  );
};
