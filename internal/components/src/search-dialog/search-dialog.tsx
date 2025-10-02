import {
  Button,
  Details,
  Dialog,
  Heading,
  Search,
} from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classes from './search-dialog.module.css';

type SearchDialogProps = {
  open: boolean;
  onClose: () => void;
};

type SearchResult = {
  title: string;
  content: string;
  url: string;
  type: 'component' | 'guide' | 'pattern' | 'blog';
  sources?: { title: string; url: string }[];
};

type SearchMode = 'quick' | 'chat';

// Simple markdown parser for bold text
const parseMarkdown = (text: string): React.ReactNode => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      // Odd indices are bold content
      return <strong key={index}>{part}</strong>;
    }
    return part;
  });
};

export const SearchDialog = ({ open, onClose }: SearchDialogProps) => {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>('quick');
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
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const endpoint =
        searchMode === 'quick' ? '/api/search' : '/api/ai-search';
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (response.ok) {
        const data = await response.json();

        if (searchMode === 'quick') {
          // Quick mode: multiple direct results
          setResults(data.results || []);
        } else {
          // Chat mode: single AI response with sources
          const result: SearchResult = {
            title: `Search results for "${searchQuery}"`,
            content: data.answer || 'No answer available',
            url: '#',
            type: 'guide',
            sources: data.sources || [],
          };
          setResults([result]);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
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
    setResults([]);
  };

  const handleClose = () => {
    setQuery('');
    setResults([]);
    onClose();
  };

  return (
    <Dialog
      ref={dialogRef}
      modal={true}
      closedby='any'
      onClose={handleClose}
      className={cl(classes.dialog)}
    >
      <Dialog.Block className={cl(classes.headerBlock)}>
        <div className={cl(classes.header)}>
          <Heading data-size='xs' className={cl(classes.title)}>
            {t('search.title', 'Search Designsystemet')}
          </Heading>
          <div className={cl(classes.modeToggle)}>
            <Button
              variant={searchMode === 'quick' ? 'primary' : 'secondary'}
              data-size='sm'
              onClick={() => {
                setSearchMode('quick');
                if (query.trim()) {
                  performSearch(query);
                }
              }}
            >
              {t('search.quick', 'Quick')}
            </Button>
            <Button
              variant={searchMode === 'chat' ? 'primary' : 'secondary'}
              data-size='sm'
              onClick={() => {
                setSearchMode('chat');
                if (query.trim()) {
                  performSearch(query);
                }
              }}
            >
              {t('search.chat', 'Chat')}
            </Button>
          </div>
        </div>
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
          <Search.Button disabled={isLoading} />
        </Search>
      </Dialog.Block>

      <Dialog.Block className={cl(classes.resultsBlock)}>
        {isLoading && (
          <div className={cl(classes.loading)}>
            {t('search.loading', 'Searching...')}
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div className={cl(classes.results)}>
            {searchMode === 'quick'
              ? // Quick mode: Simple list of results
                results.map((result, index) => (
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
                      <span className={cl(classes.resultType)}>
                        {result.type}
                      </span>
                    </div>
                    <p className={cl(classes.quickResultContent)}>
                      {result.content}
                    </p>
                  </div>
                ))
              : // Chat mode: Expandable details with sources
                results.map((result, index) => (
                  <Details
                    key={index}
                    defaultOpen={true}
                    className={cl(classes.result)}
                  >
                    <Details.Summary className={cl(classes.resultSummary)}>
                      <div className={cl(classes.resultHeader)}>
                        <h3 className={cl(classes.resultTitle)}>
                          {result.title}
                        </h3>
                        <span className={cl(classes.resultType)}>
                          {result.type}
                        </span>
                      </div>
                    </Details.Summary>
                    <Details.Content className={cl(classes.resultContent)}>
                      <div className={cl(classes.answerContent)}>
                        {parseMarkdown(result.content)}
                      </div>
                      {result.sources && result.sources.length > 0 && (
                        <div className={cl(classes.sources)}>
                          <h4 className={cl(classes.sourcesTitle)}>
                            {t('search.sources', 'Sources')}
                          </h4>
                          <ul className={cl(classes.sourcesList)}>
                            {result.sources.map((source, sourceIndex) => (
                              <li
                                key={sourceIndex}
                                className={cl(classes.sourceItem)}
                              >
                                <a
                                  href={source.url}
                                  className={cl(classes.sourceLink)}
                                  onClick={handleClose}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                >
                                  {source.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Details.Content>
                  </Details>
                ))}
          </div>
        )}

        {!isLoading && query && results.length === 0 && (
          <div className={cl(classes.noResults)}>
            {t('search.no-results', 'No results found for')} "{query}"
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
      </Dialog.Block>
    </Dialog>
  );
};
