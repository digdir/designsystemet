import {
  Button,
  Dialog,
  Divider,
  Heading,
  Search,
  Skeleton,
  Tag,
} from '@digdir/designsystemet-react';
import { XMarkIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const debounceTimeoutRef = useRef<number | null>(null);

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

  // Cleanup debounce timeout on unmount or dialog close
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce search with 300ms delay (industry standard)
    debounceTimeoutRef.current = window.setTimeout(() => {
      performSearch(value);
    }, 300);
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
              'Search for components, guides, and more',
            )}
            placeholder={t(
              'search.placeholder',
              'Search for components, guides, and more...',
            )}
            value={query}
            onChange={handleInputChange}
            autoFocus
          />
          <Search.Clear onClick={handleClear} />
          <Search.Button disabled={isQuickLoading || isSmartLoading} />
        </Search>
      </Dialog.Block>

      <Dialog.Block className={cl(classes.resultsBlock)}>
        {query && (
          <div className={cl(classes.results)}>
            {/* Smart answer section (only for 2+ words) */}
            {query.trim().split(/\s+/).length > 1 && (
              <section aria-live='polite' aria-busy={isSmartLoading}>
                {isSmartLoading ? (
                  <div
                    className={cl(cx('smartBox'))}
                    style={{ minHeight: 275 }}
                  >
                    <div className={cl(cx('smartSkeletonLines'))}>
                      <Skeleton variant='text' width={40} />
                      <Skeleton variant='text' width={48} />
                      <Skeleton variant='text' width={36} />
                      <Skeleton height='12px' width='40%' />
                    </div>
                  </div>
                ) : smartResult?.content ? (
                  <div className={cl(cx('smartBox'))}>
                    <div
                      className={cl(
                        cx('smartContent'),
                        !smartExpanded && cx('smartCollapsed'),
                      )}
                    >
                      {parseMarkdown(smartResult.content)}
                    </div>
                    <div className={cl(cx('smartActions'))}>
                      <Button
                        variant='secondary'
                        data-size='sm'
                        onClick={() => setSmartExpanded((v) => !v)}
                        className={cl(cx('smartToggle'))}
                      >
                        {smartExpanded
                          ? t('search.show-less', 'Vis mindre')
                          : t('search.show-more', 'Vis mer')}
                      </Button>
                    </div>
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
                <Divider />
              </section>
            )}

            {/* Quick results */}
            {quickResults.slice(0, visibleQuickCount).map((result, index) => (
              <div key={index} className={cl(classes.quickResult)}>
                <div className={cl(classes.resultHeader)}>
                  <h3 className={cl(classes.resultTitle)}>
                    <a
                      href={result.url}
                      className={cl(classes.quickResultLink)}
                      onClick={handleClose}
                    >
                      {result.title}
                    </a>
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
                <p className={cl(classes.quickResultContent)}>
                  {result.content}
                </p>
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
          </div>
        )}

        {!query && (
          <div className={cl(classes.suggestions)}>
            <p>{t('search.suggestions-title', 'Try searching for:')}</p>
            <ul className={cl(classes.suggestionsList)}>
              <li>
                <button
                  className={cl(classes.suggestionButton)}
                  onClick={() => {
                    setQuery('Button component');
                    performSearch('Button component');
                  }}
                >
                  Button component
                </button>
              </li>
              <li>
                <button
                  className={cl(classes.suggestionButton)}
                  onClick={() => {
                    setQuery('Design tokens');
                    performSearch('Design tokens');
                  }}
                >
                  Design tokens
                </button>
              </li>
              <li>
                <button
                  className={cl(classes.suggestionButton)}
                  onClick={() => {
                    setQuery('Accessibility guidelines');
                    performSearch('Accessibility guidelines');
                  }}
                >
                  Accessibility guidelines
                </button>
              </li>
            </ul>
          </div>
        )}

        {query &&
          !isQuickLoading &&
          !isSmartLoading &&
          quickResults.length === 0 &&
          !smartResult && (
            <div className={cl(classes.noResults)}>
              {t('search.no-results', 'No results found for')} "{query}"
            </div>
          )}
      </Dialog.Block>
    </Dialog>
  );
};
