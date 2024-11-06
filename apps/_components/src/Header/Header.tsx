'use client';
import { Button, Paragraph, SkipLink } from '@digdir/designsystemet-react';
import {
  MenuHamburgerIcon,
  MoonIcon,
  SunIcon,
  XMarkIcon,
} from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import classes from './Header.module.css';
import { DsLogo } from './logos/ds-logo';
import { FigmaLogo } from './logos/figma-logo';
import { GithubLogo } from './logos/github-logo';

type HeaderProps = {
  menu: { name: string; href: string }[];
  betaTag?: boolean;
  skipLink?: boolean;
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

/**
 * Only works in next.js projects
 */
const Header = ({ menu, betaTag, skipLink = true }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const [isHamburger, setIsHamburger] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const [theme, setTheme] = useState('light');

  const handleThemeChange = () => {
    document.documentElement.setAttribute('data-ds-color-mode', theme);
  };

  useEffect(() => {
    handleThemeChange();
  }, [theme]);

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
    <>
      {skipLink ? (
        <SkipLink href='#main'>Hopp til hovedinnhold</SkipLink>
      ) : null}
      <header
        className={cl(classes.header, isHamburger && classes.hamburger)}
        ref={headerRef}
      >
        <div className={classes.container}>
          <div className={classes.logoContainer}>
            <Link
              className={cl(classes.logoLink, 'ds-focus')}
              href='/'
              aria-label='Designsystem forside'
              onClick={() => setOpen(false)}
              prefetch={false}
            >
              <DsLogo className={classes.logo} />
            </Link>
            {betaTag && <div className={classes.tag}>Beta</div>}
          </div>
          <nav>
            <button
              aria-expanded={open}
              aria-label='Meny'
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
            </button>
            <ul
              ref={menuRef}
              className={cl(classes.menu, open && classes.active)}
            >
              {menu.map((item, index) => (
                <li className={classes.item} key={index}>
                  <Paragraph data-size='md' asChild>
                    <Link
                      suppressHydrationWarning
                      href={item.href}
                      onClick={() => setOpen(false)}
                      prefetch={false}
                      className={cl(
                        pathname.includes(item.href) && classes.active,
                        classes.link,
                        'ds-focus',
                      )}
                    >
                      {item.name}
                    </Link>
                  </Paragraph>
                </li>
              ))}
              <li
                className={cl(
                  classes.item,
                  classes.itemIcon,
                  classes.firstIcon,
                )}
              >
                <Link
                  href='https://github.com/digdir/designsystemet'
                  className={cl(classes.linkIcon, classes.github, 'ds-focus')}
                  title='Designsystemets GitHub-repositorium'
                >
                  <GithubLogo />
                </Link>
              </li>
              <li className={cl(classes.item, classes.itemIcon)}>
                <Link
                  href='https://www.figma.com/@designsystemet'
                  className={cl(classes.linkIcon, classes.figma, 'ds-focus')}
                  title='Designsystemets Figma-prosjekt'
                >
                  <FigmaLogo />
                </Link>
              </li>
              <li className={cl(classes.item, classes.itemIcon)}>
                {isHamburger && (
                  <Button
                    variant='tertiary'
                    onClick={() => {
                      setTheme(theme === 'light' ? 'dark' : 'light');
                    }}
                    icon={true}
                    color='neutral'
                  >
                    {theme === 'light' ? (
                      <SunIcon fontSize='1em' />
                    ) : (
                      <MoonIcon fontSize='1em' />
                    )}
                  </Button>
                )}
              </li>
            </ul>
            {!isHamburger && (
              <Button
                variant='tertiary'
                onClick={() => {
                  setTheme(theme === 'light' ? 'dark' : 'light');
                }}
                icon={true}
                color='neutral'
              >
                {theme === 'light' ? (
                  <SunIcon fontSize='1em' />
                ) : (
                  <MoonIcon fontSize='1em' />
                )}
              </Button>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

export { Header };
