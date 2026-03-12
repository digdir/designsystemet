import {
  Button,
  Dropdown,
  Paragraph,
  Tooltip,
} from '@digdir/designsystemet-react';
import {
  LanguageIcon,
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
import classes from './header.module.css';
import { SearchTrigger } from './search-trigger';

export type HeaderSearchConfig = {
  /**
   * Callback when search is triggered
   */
  onSearchClick: () => void;
};

type HeaderProps = {
  menu: { name: TemplateStringsArray; href: string }[];
  themeSwitcher?: boolean;
  logoLink?: string;
  /**
   * Search configuration. If provided, shows a search trigger in the header.
   */
  search?: HeaderSearchConfig;
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
  themeSwitcher = false,
  logoLink = '/',
  search: searchConfig,
  className,
  ...props
}: HeaderProps) => {
  const { pathname, search } = useLocation();
  const { t } = useTranslation();

  const getNewLangPaths = () => {
    const pathWithoutLang = pathname.split('/').slice(2).join('/');
    return {
      no: `/no/${pathWithoutLang}${search}`,
      en: `/en/${pathWithoutLang}${search}`,
    };
  };

  const langPaths = getNewLangPaths();
  const [isHamburger, setIsHamburger] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [langOpen, setLangOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const hamburgerMenu = useRef<HTMLDivElement>(null);
  const closeMenuRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const [theme, setTheme] = useState('light');

  //close mobile menu when tabfocus leaves the header
  const handleBlur = (e: FocusEvent) => {
    if (
      hamburgerMenu.current &&
      e.relatedTarget instanceof Node &&
      !hamburgerMenu.current.contains(e.relatedTarget)
    ) {
      closeMenuRef.current?.click();
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
    <>
      {Object.keys(langPaths).map((p) => {
        return (
          <link
            rel='alternate'
            href={langPaths[p as keyof typeof langPaths]}
            hrefLang={p}
            key={p + '-alt-path'}
          />
        );
      })}
      <header
        className={cl(
          classes.header,
          isHamburger && classes.hamburger,
          className,
        )}
        ref={headerRef}
        {...props}
      >
        <div className={classes.container}>
          <div className={classes.logoContainer}>
            <Link
              className={cl(classes.logoLink, 'ds-focus')}
              to={logoLink}
              aria-label={t('header.home-link')}
            >
              <DsEmbledLogo className={classes.logo} />
              <DsFullLogo className={classes.logoWide} />
            </Link>
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
            {searchConfig && (
              <SearchTrigger onClick={searchConfig.onSearchClick} />
            )}
            <Dropdown.TriggerContext>
              <Dropdown.Trigger
                variant='tertiary'
                data-color='neutral'
                className={classes.toggleButton}
                onClick={() => setLangOpen(!langOpen)}
                lang='en'
              >
                <LanguageIcon aria-hidden />
                <span>Language</span>
              </Dropdown.Trigger>

              <Dropdown open={langOpen} onClose={() => setLangOpen(false)}>
                <Dropdown.Button asChild onClick={() => setLangOpen(false)}>
                  <Link to={langPaths.no} lang='no' hrefLang='no'>
                    Norsk
                  </Link>
                </Dropdown.Button>
                <Dropdown.Button asChild onClick={() => setLangOpen(false)}>
                  <Link to={langPaths.en} lang='en' hrefLang='en'>
                    English
                  </Link>
                </Dropdown.Button>
              </Dropdown>
            </Dropdown.TriggerContext>
            {themeSwitcher && (
              <Tooltip
                content={t('header.theme-toggle', {
                  theme:
                    theme === 'light' ? t('header.dark') : t('header.light'),
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
                    <SunIcon aria-hidden />
                  ) : (
                    <MoonIcon aria-hidden />
                  )}
                </Button>
              </Tooltip>
            )}
            {isHamburger && (
              <>
                <Button
                  variant='tertiary'
                  icon={true}
                  data-color='neutral'
                  aria-label={t('header.open-menu')}
                  className={cl(classes.toggle, 'ds-focus')}
                  popoverTarget='hamburgerMenu'
                  popoverTargetAction='show'
                >
                  <MenuHamburgerIcon
                    aria-hidden
                    color='var(--ds-color-neutral-text-default)'
                  />
                </Button>
                {/* biome-ignore lint/a11y/noStaticElementInteractions: onBlur bubbles from children that are interactive and must be captured here */}
                <div
                  className={classes.listContainer}
                  id='hamburgerMenu'
                  popover='auto'
                  ref={hamburgerMenu}
                  onBlur={handleBlur}
                >
                  <div className={classes.hamburgerHeader}>
                    <Link
                      className={cl(classes.hamburgerLogo, 'ds-focus')}
                      to={logoLink}
                      aria-label={t('header.home-link')}
                    >
                      <DsFullLogo />
                    </Link>
                    <Button
                      data-color='neutral'
                      ref={closeMenuRef}
                      icon={true}
                      popoverTarget='hamburgerMenu'
                      popoverTargetAction='hide'
                      variant='tertiary'
                      aria-label={t('header.close-menu')}
                    >
                      <XMarkIcon
                        aria-hidden
                        color='var(--ds-color-neutral-text-default)'
                      />
                    </Button>
                  </div>
                  <ul>
                    {menu.map((item, index) => (
                      <li key={index}>
                        <Paragraph data-size='md' asChild>
                          <Link
                            suppressHydrationWarning
                            to={item.href}
                            onClick={() => closeMenuRef.current?.click()}
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
                </div>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

export { Header };
