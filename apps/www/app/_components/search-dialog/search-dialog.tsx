import type { Color, SeverityColors } from '@digdir/designsystemet/types';
import {
  Button,
  Chip,
  Dialog,
  Heading,
  Paragraph,
  Search,
  Skeleton,
  Tag,
} from '@digdir/designsystemet-react';
import { useDebounceCallback } from '@internal/components';
import {
  ComponentFillIcon,
  FileSearchIcon,
  HandShakeHeartIcon,
  HexagonGridIcon,
  InformationIcon,
  NewspaperIcon,
  TasklistIcon,
} from '@navikt/aksel-icons';
import cl from 'clsx';
import type { ChangeEvent, CSSProperties, ReactNode } from 'react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { highlightText } from '~/_utils/highlight';
import { RRLink as Link } from '../link';
import classes from './search-dialog.module.css';

type SearchResult = {
  id: string;
  title: string;
  description: string;
  url: string;
  type: string;
};

type SearchDialogProps = {
  open: boolean;
  onClose: () => void;
  lang: string;
};

export const SearchDialog = ({ open, onClose, lang }: SearchDialogProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [quickResults, setQuickResults] = useState<SearchResult[]>([]);
  const [isQuickLoading, setIsQuickLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [resultAnnounce, setresultAnnounce] = useState('');
  const latestQueryRef = useRef<string>('');

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setQuickResults([]);
      setIsQuickLoading(false);
      debouncedAnnounce('');
      return;
    }

    latestQueryRef.current = searchQuery;
    await handleSearch(searchQuery);
  };

  const debouncedCallback = useDebounceCallback((value: string) => {
    performSearch(value);
    setIsTyping(false);
  }, 1);

  /*delay screen reader announce text so it is not interrupted by input (apple voiceover)*/
  const debouncedAnnounce = useDebounceCallback((value: string) => {
    setresultAnnounce(value);
  }, 1000);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsTyping(true);
    setQuery(value);
    debouncedCallback(value);
  };

  const handleClear = () => {
    setQuery('');
    setQuickResults([]);
    setIsQuickLoading(false);
  };

  const handleClose = () => {
    setQuery('');
    setQuickResults([]);
    setIsQuickLoading(false);
    onClose();
  };

  const handleSearch = async (query: string) => {
    setIsQuickLoading(true);
    const controller = new AbortController();
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&lang=${lang}`,
        { signal: controller.signal },
      );
      const data = await response.json();
      setQuickResults(data.results || []);
      debouncedAnnounce(
        `${t('search.srA')} ${data.results.length} ${t('search.srB')} ${query}`,
      );
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Search error:', error);
        if (latestQueryRef.current === query) setQuickResults([]);
      }
    } finally {
      if (latestQueryRef.current === query) setIsQuickLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, ReactNode> = {
      intro: (
        <>
          <InformationIcon aria-hidden='true' /> {t('search.type.intro')}
        </>
      ),
      component: (
        <>
          <ComponentFillIcon aria-hidden='true' /> {t('search.type.component')}
        </>
      ),
      blog: (
        <>
          <NewspaperIcon aria-hidden='true' />
          {t('search.type.blog')}
        </>
      ),
      fundamentals: (
        <>
          <TasklistIcon aria-hidden='true' />
          {t('search.type.fundamentals')}
        </>
      ),
      'best-practices': (
        <>
          <HandShakeHeartIcon aria-hidden='true' />
          {t('search.type.best-practices')}
        </>
      ),
      patterns: (
        <>
          <HexagonGridIcon aria-hidden='true' />
          {t('search.type.patterns')}
        </>
      ),
    };
    return labels[type] || type;
  };
  const getTypeColor = (type: string) => {
    const labels: Record<string, Color | SeverityColors> = {
      intro: 'brand2',
      component: 'brand3',
      blog: 'success',
      fundamentals: 'brand2',
      'best-practices': 'brand1',
      patterns: 'brand1',
    };
    return labels[type] || 'neutral';
  };

  return (
    <Dialog
      closedby='any'
      open={open}
      onClose={handleClose}
      className={cl(classes.dialog, 'search-dialog')}
      closeButton={false}
    >
      <Button
        aria-label={t('search.close')}
        data-color='neutral'
        icon
        variant='tertiary'
        data-command='close'
      />
      <div className={classes.aboveScroll}>
        <Dialog.Block className={classes.searchBlock}>
          <Heading data-size='sm' className={classes.title}>
            {t('search.title')}
          </Heading>
          <Search>
            <Search.Input
              className={classes.input}
              autoFocus={true}
              aria-label={t('search.label')}
              placeholder={t('search.placeholder')}
              value={query}
              onChange={handleInputChange}
            />
            <Search.Clear onClick={handleClear} />
          </Search>
          <div
            className='ds-sr-only'
            aria-live='assertive'
            aria-atomic='true'
            aria-relevant='text'
          >
            {resultAnnounce}
          </div>
        </Dialog.Block>
      </div>

      <div className={classes.resultsContainer}>
        {query && (
          <div className={classes.results}>
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
              <section
                className={classes.resultsBlock}
                ref={(el) => {
                  query.length > 1 && el && highlightText(query, el);
                }}
              >
                <Heading className={classes.iconHeading} data-size='sm'>
                  <FileSearchIcon /> {t('search.results')}
                </Heading>
                {quickResults.map((result, index) => (
                  <div
                    key={result.id}
                    style={{ '--i': `${index}` } as CSSProperties}
                    className={classes.quickResult}
                  >
                    <div className={classes.resultHeader}>
                      <h3 className={classes.resultTitle}>
                        <Link
                          to={result.url}
                          className={classes.quickResultLink}
                          onClick={handleClose}
                        >
                          {result.title}
                        </Link>
                      </h3>
                      <Tag
                        data-size='sm'
                        data-color={getTypeColor(result.type)}
                        className={classes.resultTag}
                      >
                        {getTypeLabel(result.type)}
                      </Tag>
                    </div>
                    <Paragraph className={classes.quickResultContent}>
                      {result.description}
                    </Paragraph>
                    <Paragraph
                      className={classes.quickResultUrl}
                      data-size='xs'
                    >
                      https://designsystemet.no{result.url}
                    </Paragraph>
                  </div>
                ))}
              </section>
            )}
          </div>
        )}

        {!query && (
          <div className={classes.resultsBlock}>
            <Paragraph className={classes.suggestionsTitle}>
              {t('search.suggestions-title')}
            </Paragraph>
            <div className={classes.suggestionsList}>
              <Chip.Button
                onClick={() => {
                  setQuery('Button');
                  performSearch('Button');
                }}
              >
                Button
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
                  setQuery(t('search.suggestions.1'));
                  performSearch(t('search.suggestions.1'));
                }}
              >
                {t('search.suggestions.1')}
              </Chip.Button>
              <Chip.Button
                onClick={() => {
                  setQuery(t('search.suggestions.2'));
                  performSearch(t('search.suggestions.2'));
                }}
              >
                {t('search.suggestions.2')}
              </Chip.Button>
            </div>
          </div>
        )}

        {query && !isTyping && !isQuickLoading && quickResults.length === 0 && (
          <div className={classes.noResults}>
            {t('search.no-results')} "{query}"
          </div>
        )}
      </div>
    </Dialog>
  );
};
