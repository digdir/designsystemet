import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import classes from './search-dialog.module.css';
import { Dialog, Search, Tag } from '@digdir/designsystemet-react';

type SearchResult = {
  id: string;
  title: string;
  description: string;
  url: string;
  type: string;
};

type SearchDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
};

export function SearchDialog({ isOpen, onClose, lang }: SearchDialogProps) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Handle dialog close event (ESC, backdrop click, etc.)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
      onClose();
    };

    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  // Open dialog when isOpen changes to true
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&lang=${lang}`,
          { signal: controller.signal },
        );
        const data = await response.json();
        setResults(data.results || []);
        setSelectedIndex(0);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Search error:', error);
        }
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, lang]);

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          navigate(results[selectedIndex].url);
          dialogRef.current?.close();
        }
        break;
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    const selected = document.querySelector(
      `[data-search-index="${selectedIndex}"]`,
    );
    selected?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      component: t('search.type.component'),
      blog: t('search.type.blog'),
      fundamentals: t('search.type.fundamentals'),
      'best-practices': t('search.type.best-practices'),
      patterns: t('search.type.patterns'),
    };
    return labels[type] || type;
  };

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  return (
    <Dialog
      ref={dialogRef}
      className={classes.dialog}
      closeButton={false}
      closedby='any'
    >
      <Dialog.Block data-color="neutral">
        <Search>
          <Search.Input
            ref={inputRef}
            className={classes.input}
            placeholder={t('search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label={t('search.label')}
          />
          <Search.Clear onClick={() => setQuery('')} />
        </Search>
      </Dialog.Block>
      <Dialog.Block className={classes.content}>

        <div className={classes.results} role='listbox'>
          {isLoading ? (
            <div className={classes.loading}>{t('search.loading')}</div>
          ) : results.length === 0 && query.trim() ? (
            <div className={classes.noResults}>{t('search.no-results')}</div>
          ) : (
            results.map((result, index) => (
              <Link
                key={result.id}
                to={result.url}
                className={classes.resultItem}
                onClick={closeDialog}
                data-search-index={index}
                data-selected={index === selectedIndex}
                role='option'
                aria-selected={index === selectedIndex}
                style={
                  index === selectedIndex
                    ? {
                        backgroundColor:
                          'var(--ds-color-neutral-surface-hover)',
                      }
                    : undefined
                }
              >
                <p className={classes.resultTitle}>{result.title}</p>
                {result.description && (
                  <p className={classes.resultDescription}>
                    {result.description}
                  </p>
                )}
                <Tag className={classes.resultType}>
                  {getTypeLabel(result.type)}
                </Tag>
              </Link>
            ))
          )}
        </div>

        <div className={classes.footer}>
          <div className={classes.shortcuts}>
            <span className={classes.shortcut}>
              <kbd className={classes.kbd}>↑</kbd>
              <kbd className={classes.kbd}>↓</kbd>
              {t('search.navigate')}
            </span>
            <span className={classes.shortcut}>
              <kbd className={classes.kbd}>↵</kbd>
              {t('search.select')}
            </span>
            <span className={classes.shortcut}>
              <kbd className={classes.kbd}>esc</kbd>
              {t('search.close')}
            </span>
          </div>
        </div>
      </Dialog.Block>
    </Dialog>
  );
}
