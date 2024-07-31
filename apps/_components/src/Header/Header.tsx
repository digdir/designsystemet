'use client';
import { SkipLink } from '@digdir/designsystemet-react';
import { MenuHamburgerIcon, XMarkIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import classes from './Header.module.css';
import { DsLogo } from './logos/ds-logo';
import { FigmaLogo } from './logos/figma-logo';
import { GithubLogo } from './logos/github-logo';

type HeaderProps = {
  menu: { name: string; href: string }[];
  betaTag?: boolean;
};

/**
 * Only works in next.js projects
 */
const Header = ({ menu, betaTag }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <SkipLink href='#main'>Hopp til hovedinnhold</SkipLink>
      <header className={classes.header}>
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
              className={classes.toggle}
              onClick={() => {
                setOpen(!open);
              }}
            >
              {open && <XMarkIcon fontSize={26} color='#1E2B3C' />}
              {!open && <MenuHamburgerIcon fontSize={26} color='#1E2B3C' />}
            </button>
            <ul className={cl(classes.menu, open && classes.active)}>
              {menu.map((item, index) => (
                <li className={classes.item} key={index}>
                  <Link
                    suppressHydrationWarning
                    href={item.href}
                    onClick={() => setOpen(false)}
                    prefetch={false}
                    className={cl(
                      pathname.includes(item.href) && classes.active,
                      classes.link,
                      'ds-paragraph--md',
                      'ds-focus',
                    )}
                  >
                    {item.name}
                  </Link>
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
                  target='_blank'
                  className={cl(classes.linkIcon, classes.github, 'ds-focus')}
                  title='Designsystemets GitHub-repositorium'
                >
                  <GithubLogo />
                </Link>
              </li>
              <li className={cl(classes.item, classes.itemIcon)}>
                <Link
                  href='https://www.figma.com/@designsystemet'
                  target='_blank'
                  className={cl(classes.linkIcon, classes.figma, 'ds-focus')}
                  title='Designsystemets Figma-prosjekt'
                >
                  <FigmaLogo />
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export { Header };
