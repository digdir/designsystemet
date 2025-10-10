import {
  Button,
  Dropdown,
  Paragraph,
  Tooltip,
} from '@digdir/designsystemet-react';
import {
  LanguageIcon,
  MagnifyingGlassIcon,
  MenuHamburgerIcon,
  MoonIcon,
  SunIcon,
  XMarkIcon,
} from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import {
  type FocusEvent,
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { DsEmbledLogo, DsFullLogo } from '../logos/designsystemet';
import { SearchDialog } from '../search-dialog';
import classes from './header.module.css';

type HeaderProps = {
  menu: { name: TemplateStringsArray; href: string }[];
  betaTag?: boolean;
  themeSwitcher?: boolean;
  transparentBackground?: boolean;
  logoLink?: string;
  onSearch?: (query: string) => void;
  onAiSearch?: (query: string) => void;
  isSearching?: boolean;
  isAiSearching?: boolean;
  searchResult?: {
    success: boolean;
    results: unknown[];
    query: string;
    error?: string;
  } | null;
  aiSearchResult?: {
    success: boolean;
    content: string;
    sources: { title: string; url: string }[];
    query: string;
    error?: string;
  } | null;
  className?: string;
} & React.HTMLAttributes<HTMLElement>;

/**
 * Detect if any items have wrapped to a new line
 */
const detectWrap = (items: HTMLCollection) => {
  const wrappedItems = [];
  let prevItem: DOMRect | null = null;

  for (let i = 0; i < items.length; i++) {
    const currItem = items[i].getBoundingClientRect();

    if (prevItem) {
      const prevItemTop = prevItem.bottom;
      const currItemTop = currItem.bottom;

      // if current's item top position is different from previous
      // that means that the item is wrapped
      if (prevItemTop < currItemTop) {
        wrappedItems.push(items[i]);
      }
    }

    prevItem = currItem;
  }

  return wrappedItems;
};

const Header = ({
  menu,
  betaTag,
  themeSwitcher = false,
  transparentBackground = false,
  onSearch,
  onAiSearch,
  isSearching,
  isAiSearching,
  searchResult,
  aiSearchResult,
  logoLink = '/',
  className,
  ...props
}: HeaderProps) => {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const getNewLangPaths = () => {
    const pathWithoutLang = pathname.split('/').slice(2).join('/');
    return {
      no: `/no/${pathWithoutLang}`,
      en: `/en/${pathWithoutLang}`,
    };
  };

  const langPaths = getNewLangPaths();

  const [open, setOpen] = useState(false);
  const [isHamburger, setIsHamburger] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [langOpen, setLangOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const [theme, setTheme] = useState('light');

  //close mobile menu when tabfocus leaves the header
  const handleBlur = (e: FocusEvent) => {
    if (!open) return;
    if (
      headerRef.current &&
      e.relatedTarget instanceof Node &&
      !headerRef.current.contains(e.relatedTarget)
    ) {
      setOpen(false);
    }
  };

  const handleThemeChange = (
    newTheme: 'dark' | 'light',
    event?: MouseEvent<HTMLButtonElement> | null,
  ) => {
    setTheme(newTheme);

    if (
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion)').matches ||
      !event
    ) {
      document.documentElement.setAttribute('data-color-scheme', newTheme);
      return;
    }

    const { left, bottom, width, height } =
      event.currentTarget.getBoundingClientRect();

    document.documentElement.style.setProperty(
      '--_theme-x',
      `${left + width / 2}px`,
    );
    document.documentElement.style.setProperty(
      '--_theme-y',
      `${bottom - height / 2}px`,
    );

    document.startViewTransition(() => {
      document.documentElement.setAttribute('data-color-scheme', newTheme);
    });
  };

  useEffect(() => {
    if (!themeSwitcher) return;
    // get user preference
    const userPreference = window.matchMedia('(prefers-color-scheme: dark)');
    const userPrefersDark = userPreference.matches;

    // set theme based on user preference
    handleThemeChange(userPrefersDark ? 'dark' : 'light', null);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (isHamburger && viewportWidth > 0) {
        const SAFETY_MARGIN = 50;
        if (window.innerWidth > viewportWidth + SAFETY_MARGIN) {
          setIsHamburger(false);
          setOpen(false);
        }
      } else if (menuRef.current && headerRef.current) {
        const wrappedItems = detectWrap(menuRef.current.children);
        if (wrappedItems.length > 0) {
          setViewportWidth(window.innerWidth);
          setIsHamburger(true);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menu, isHamburger, viewportWidth]);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: onBlur bubbles from children that are interactive and must be captured here
    <header
      className={cl(
        classes.header,
        isHamburger && classes.hamburger,
        transparentBackground && classes.transparentHeader,
        className,
      )}
      ref={headerRef}
      onBlur={handleBlur}
      {...props}
    >
      <div className={classes.container}>
        <div className={classes.logoContainer}>
          <Link
            className={cl(classes.logoLink, 'ds-focus')}
            to={logoLink}
            aria-label={t('header.home-link')}
            onClick={() => setOpen(false)}
          >
            {isHamburger ? (
              <DsEmbledLogo className={classes.logo} />
            ) : (
              <DsFullLogo className={classes.logo} />
            )}
          </Link>
          {betaTag && <div className={classes.tag}>Beta</div>}
        </div>
        <nav data-mobile={isHamburger}>
          <ul ref={menuRef} className={classes.desktopMenu}>
            {menu.map((item, index) => (
              <li key={index}>
                <Paragraph data-size='md' asChild>
                  <Link
                    suppressHydrationWarning
                    to={item.href}
                    className={cl(
                      pathname?.includes(item.href) && classes.active,
                      'ds-focus',
                    )}
                  >
                    {t(item.name)}
                  </Link>
                </Paragraph>
              </li>
            ))}
          </ul>
          <Button
            aria-label={t('header.search-toggle-aria', 'Open search dialog')}
            variant='tertiary'
            data-color='neutral'
            onClick={() => setSearchOpen(true)}
            className={classes.searchButton}
          >
            <MagnifyingGlassIcon fontSize='1.75em' aria-hidden /> Søk
          </Button>
          {themeSwitcher && (
            <Tooltip
              content={t('header.theme-toggle', {
                theme: theme === 'light' ? t('header.dark') : t('header.light'),
              })}
              placement='bottom'
            >
              <Button
                aria-label={t('header.theme-toggle-aria', {
                  theme:
                    theme === 'light' ? t('header.dark') : t('header.light'),
                })}
                variant='tertiary'
                data-color='neutral'
                icon={true}
                onClick={(e) => {
                  handleThemeChange(theme === 'light' ? 'dark' : 'light', e);
                }}
                className={classes.toggleButton}
              >
                {theme === 'dark' ? (
                  <SunIcon fontSize='1.75em' aria-hidden />
                ) : (
                  <MoonIcon fontSize='1.75em' aria-hidden />
                )}
              </Button>
            </Tooltip>
          )}
          <Dropdown.TriggerContext>
            <Tooltip content={t('header.language-toggle')} placement='bottom'>
              <div>
                <Dropdown.Trigger
                  icon={true}
                  variant='tertiary'
                  data-color='neutral'
                  className={classes.toggleButton}
                  onClick={() => setLangOpen(!langOpen)}
                  aria-label={t('header.language-toggle')}
                >
                  <LanguageIcon aria-hidden />
                </Dropdown.Trigger>
              </div>
            </Tooltip>
            <Dropdown open={langOpen} onClose={() => setLangOpen(false)}>
              <Dropdown.Button asChild onClick={() => setLangOpen(false)}>
                <Link to={langPaths.no} lang='no'>
                  Norsk
                </Link>
              </Dropdown.Button>
              <Dropdown.Button asChild onClick={() => setLangOpen(false)}>
                <Link to={langPaths.en} lang='en'>
                  English
                </Link>
              </Dropdown.Button>
            </Dropdown>
          </Dropdown.TriggerContext>
          {isHamburger && (
            <>
              <Button
                variant='tertiary'
                icon={true}
                data-color='neutral'
                aria-expanded={open}
                aria-label={
                  open ? t('header.close-menu') : t('header.open-menu')
                }
                className={cl(classes.toggle, 'ds-focus')}
                onClick={() => {
                  setOpen(!open);
                }}
              >
                {open && (
                  <XMarkIcon
                    aria-hidden
                    fontSize={26}
                    color='var(--ds-color-neutral-text-default)'
                  />
                )}
                {!open && (
                  <MenuHamburgerIcon
                    aria-hidden
                    fontSize={26}
                    color='var(--ds-color-neutral-text-default)'
                  />
                )}
              </Button>
              <ul data-open={open}>
                {menu.map((item, index) => (
                  <li key={index}>
                    <Paragraph data-size='md' asChild>
                      <Link
                        suppressHydrationWarning
                        to={item.href}
                        onClick={() => setOpen(false)}
                        className={cl(
                          pathname?.includes(item.href) && classes.active,
                          'ds-focus',
                        )}
                      >
                        {t(item.name)}
                      </Link>
                    </Paragraph>
                  </li>
                ))}
              </ul>
            </>
          )}
        </nav>
      </div>
      <SearchDialog
        onSearch={onSearch}
        onAiSearch={onAiSearch}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        isSearching={isSearching}
        isAiSearching={isAiSearching}
        searchResult={searchResult}
        aiSearchResult={aiSearchResult}
      />
    </header>
  );
};

export { Header };
