import {
  Button,
  Dropdown,
  Paragraph,
  Tooltip,
} from '@digdir/designsystemet-react';
import {
  GlobeIcon,
  MenuHamburgerIcon,
  MoonIcon,
  SunIcon,
  XMarkIcon,
} from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { DsEmbledLogo, DsFullLogo } from '../logos/designsystemet';
import classes from './header.module.css';
import { FigmaLogo } from './logos/figma-logo';
import { GithubLogo } from './logos/github-logo';

type HeaderProps = {
  menu: { name: TemplateStringsArray; href: string }[];
  betaTag?: boolean;
  themeSwitcher?: boolean;
  transparentBackground?: boolean;
  logoLink?: string;
};

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
  logoLink = '/',
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
  const [langOpen, setLangOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const [theme, setTheme] = useState('light');

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-color-scheme', newTheme);
  };

  useEffect(() => {
    if (!themeSwitcher) return;
    // get user preference
    const userPreference = window.matchMedia('(prefers-color-scheme: dark)');
    const userPrefersDark = userPreference.matches;

    // set theme based on user preference
    handleThemeChange(userPrefersDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (isHamburger) return;
      if (menuRef.current && headerRef.current) {
        const wrappedItems = detectWrap(menuRef.current.children);
        setIsHamburger(wrappedItems.length > 0);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menu, isHamburger]);

  return (
    <header
      className={cl(
        classes.header,
        isHamburger && classes.hamburger,
        transparentBackground && classes.transparentHeader,
      )}
      ref={headerRef}
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
        <nav className={isHamburger ? classes.mobile : ''}>
          {isHamburger && (
            <Button
              variant='tertiary'
              icon={true}
              data-color='neutral'
              aria-expanded={open}
              aria-label={t('header.menu')}
              className={cl(classes.toggle, 'ds-focus')}
              onClick={() => {
                setOpen(!open);
              }}
            >
              {open && (
                <XMarkIcon
                  fontSize={26}
                  color='var(--ds-color-neutral-text-default)'
                />
              )}
              {!open && (
                <MenuHamburgerIcon
                  fontSize={26}
                  color='var(--ds-color-neutral-text-default)'
                />
              )}
            </Button>
          )}
          <ul
            ref={menuRef}
            className={cl(classes.menu, open && classes.active)}
          >
            {menu.map((item, index) => (
              <li className={classes.item} key={index}>
                <Paragraph data-size='md' asChild>
                  <Link
                    suppressHydrationWarning
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={cl(
                      pathname?.includes(item.href) && classes.active,
                      classes.link,
                      'ds-focus',
                    )}
                  >
                    {t(item.name)}
                  </Link>
                </Paragraph>
              </li>
            ))}
            <li
              className={cl(classes.item, classes.itemIcon, classes.firstIcon)}
            >
              <Link
                to='https://github.com/digdir/designsystemet'
                className={cl(classes.linkIcon, classes.github, 'ds-focus')}
                title={t('header.github-title')}
              >
                <GithubLogo />
              </Link>
            </li>
            <li className={cl(classes.item, classes.itemIcon)}>
              <Link
                to='https://www.figma.com/@designsystemet'
                className={cl(classes.linkIcon, classes.figma, 'ds-focus')}
                title={t('header.figma-title')}
              >
                <FigmaLogo />
              </Link>
            </li>
          </ul>
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
                onClick={() => {
                  handleThemeChange(theme === 'light' ? 'dark' : 'light');
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
                  variant='tertiary'
                  data-color='neutral'
                  className={classes.toggleButton}
                  onClick={() => setLangOpen(!langOpen)}
                  aria-label={t('header.language-toggle')}
                >
                  <GlobeIcon />
                </Dropdown.Trigger>
              </div>
            </Tooltip>
            <Dropdown open={langOpen} onClose={() => setLangOpen(false)}>
              <Dropdown.Button asChild onClick={() => setLangOpen(false)}>
                <Link to={langPaths.no}>Norsk</Link>
              </Dropdown.Button>
              <Dropdown.Button asChild onClick={() => setLangOpen(false)}>
                <Link to={langPaths.en}>English</Link>
              </Dropdown.Button>
            </Dropdown>
          </Dropdown.TriggerContext>
        </nav>
      </div>
    </header>
  );
};

export { Header };
