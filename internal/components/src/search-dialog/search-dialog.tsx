import {
  Button,
  Dialog,
  Heading,
  Search,
} from '@digdir/designsystemet-react';
import { XMarkIcon } from '@navikt/aksel-icons';
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
};

export const SearchDialog = ({ open, onClose }: SearchDialogProps) => {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (response.ok) {
        const data = await response.json();
        // Transform AI response to our result format
        // This will need to be adjusted based on your actual API response
        setResults([
          {
            title: 'AI Result',
            content: data.answer || 'No answer available',
            url: '#',
            type: 'guide',
          },
        ]);
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
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
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
      closedby="any"
      onClose={handleClose}
      className={classes.dialog}
    >
      <Dialog.Block className={classes.headerBlock}>
        <div className={classes.header}>
          <Heading data-size="xs" className={classes.title}>
            {t('search.title', 'Search Designsystemet')}
          </Heading>
          <Button
            variant="tertiary"
            icon={true}
            onClick={handleClose}
            aria-label={t('search.close', 'Close search')}
            className={classes.closeButton}
          >
            <XMarkIcon fontSize="1.5em" aria-hidden />
          </Button>
        </div>
      </Dialog.Block>

      <Dialog.Block className={classes.searchBlock}>
        <Search className={classes.search}>
          <Search.Input
            aria-label={t('search.input-label', 'Search for components, guides, and more')}
            placeholder={t('search.placeholder', 'Search for components, guides, and more...')}
            value={query}
            onChange={handleInputChange}
            autoFocus
          />
          <Search.Clear onClick={handleClear} />
          <Search.Button disabled={isLoading} />
        </Search>
      </Dialog.Block>

      <Dialog.Block className={classes.resultsBlock}>
        {isLoading && (
          <div className={classes.loading}>
            {t('search.loading', 'Searching...')}
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div className={classes.results}>
            {results.map((result, index) => (
              <div key={index} className={classes.result}>
                <div className={classes.resultHeader}>
                  <h3 className={classes.resultTitle}>{result.title}</h3>
                  <span className={classes.resultType}>{result.type}</span>
                </div>
                <p className={classes.resultContent}>{result.content}</p>
                {result.url !== '#' && (
                  <a 
                    href={result.url} 
                    className={classes.resultLink}
                    onClick={handleClose}
                  >
                    {t('search.view-result', 'View result')}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {!isLoading && query && results.length === 0 && (
          <div className={classes.noResults}>
            {t('search.no-results', 'No results found for')} "{query}"
          </div>
        )}

        {!query && (
          <div className={classes.suggestions}>
            <p>{t('search.suggestions-title', 'Try searching for:')}</p>
            <ul className={classes.suggestionsList}>
              <li>
                <button 
                  className={classes.suggestionButton}
                  onClick={() => {
                    setQuery('Button component');
                    handleSearch('Button component');
                  }}
                >
                  Button component
                </button>
              </li>
              <li>
                <button 
                  className={classes.suggestionButton}
                  onClick={() => {
                    setQuery('Design tokens');
                    handleSearch('Design tokens');
                  }}
                >
                  Design tokens
                </button>
              </li>
              <li>
                <button 
                  className={classes.suggestionButton}
                  onClick={() => {
                    setQuery('Accessibility guidelines');
                    handleSearch('Accessibility guidelines');
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
