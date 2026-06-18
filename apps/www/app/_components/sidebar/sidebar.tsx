import { Button, Link, Paragraph, Search } from '@digdir/designsystemet-react';
import { useDebounceCallback } from '@internal/components';
import { ChevronRightLastIcon, XMarkIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import {
  type HTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import classes from './sidebar.module.css';

export type SidebarProps = {
  cats: {
    [key: string]: {
      title: string;
      url: string;
      keywords?: string;
    }[];
  };
  title: string;
  hideCatTitle?: boolean;
  /**
   * Show a search input above the sidebar navigation that filters items by
   * title and keywords.
   */
  searchable?: boolean;
  /**
   * mapped list of suffixes to it's category key
   */
  suffix?: {
    [categoryKey: string]: string;
  };
} & HTMLAttributes<HTMLDivElement>;

export const Sidebar = ({
  cats,
  title,
  hideCatTitle = false,
  searchable = false,
  suffix = {},
  className,
  ...props
}: SidebarProps) => {
  const { t } = useTranslation();
  const closeMenuRef = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState('');

  const filteredCats = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return cats;
    }

    const result: SidebarProps['cats'] = {};
    for (const [key, value] of Object.entries(cats)) {
      const items = value.filter((item) => {
        const itemTitle = t(`sidebar.items.${item.title}`, item.title);
        const haystack =
          `${itemTitle} ${item.title} ${item.keywords ?? ''}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      });
      if (items.length) {
        result[key] = items;
      }
    }
    return result;
  }, [cats, query, t]);

  const hasResults = Object.values(filteredCats).some(
    (value) => value.length > 0,
  );

  const resultCount = useMemo(
    () =>
      Object.values(filteredCats).reduce((sum, value) => sum + value.length, 0),
    [filteredCats],
  );

  const [announce, setAnnounce] = useState('');
  /* delay announce so it is not interrupted while the user is typing */
  const debouncedAnnounce = useDebounceCallback((value: string) => {
    setAnnounce(value);
  }, 1000);

  useEffect(() => {
    if (!searchable || !query.trim()) {
      debouncedAnnounce('');
      return;
    }
    debouncedAnnounce(
      `${t('search.srA')} ${resultCount} ${t('search.srB')} ${query}`,
    );
  }, [searchable, query, resultCount, t, debouncedAnnounce]);

  return (
    <div
      className={cl(className, 'l-sidebar-left', classes.sidebar)}
      {...props}
    >
      <Button
        className={classes.toggleBtn}
        data-size='md'
        data-color='neutral'
        variant='secondary'
        popoverTarget='sidebar-nav'
        popoverTargetAction='show'
      >
        {t('sidebar.show')} {t(`sidebar.sidebar`)}
        <ChevronRightLastIcon aria-hidden />
      </Button>

      <nav popover='auto' id='sidebar-nav' className={cl(classes.menu)}>
        <Button
          data-color='neutral'
          ref={closeMenuRef}
          icon={true}
          popoverTarget='sidebar-nav'
          popoverTargetAction='hide'
          variant='secondary'
          aria-label={t('header.close-menu')}
          className={classes.closeButton}
        >
          <XMarkIcon aria-hidden />
          {/* {t('sidebar.hide')} {t(`sidebar.sidebar`)} */}
        </Button>
        {hideCatTitle ? null : (
          <Paragraph data-size='md' className={classes.title}>
            {t(`sidebar.${title}`, title)}
          </Paragraph>
        )}
        {searchable ? (
          <Search className={classes.search} data-size='sm'>
            <Search.Input
              aria-label={t('sidebar.search.label', 'Search')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search.Clear onClick={() => setQuery('')} />
          </Search>
        ) : null}
        {searchable ? (
          <div
            className='ds-sr-only'
            aria-live='assertive'
            aria-atomic='true'
            aria-relevant='text'
          >
            {announce}
          </div>
        ) : null}
        {searchable && !hasResults ? (
          <Paragraph data-size='sm' className={classes.noResults}>
            {t('sidebar.search.noResults', 'No results')}
          </Paragraph>
        ) : null}
        <ul className={classes.list}>
          {Object.entries(filteredCats).map(([key, value]) => {
            if (!value.length) {
              return null;
            }
            return (
              <li key={key} className={classes.listGroup}>
                <Paragraph asChild>
                  <div className={classes.innerTitle}>
                    {t(`sidebar.categories.${key}`, key)}
                  </div>
                </Paragraph>
                <ul className={classes.innerList}>
                  {value.map((item) => {
                    const url = `${item.url}`;

                    return (
                      <li key={item.url} className={classes.listItem}>
                        <Paragraph asChild data-size='sm'>
                          <Link asChild>
                            <NavLink
                              to={url + (suffix[key] || '')}
                              className={cl(classes.link)}
                              onClick={() => closeMenuRef.current?.click()}
                            >
                              {t(`sidebar.items.${item.title}`, item.title)}
                            </NavLink>
                          </Link>
                        </Paragraph>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
