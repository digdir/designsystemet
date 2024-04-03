/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MenuHamburgerIcon, XMarkIcon } from '@navikt/aksel-icons';
import cl from 'clsx';
import type { SanityDocument } from 'next-sanity';

import { GithubLogo } from './logos/github-logo';
import { FigmaLogo } from './logos/figma-logo';
import classes from './Header.module.css';
import { Menu } from './Menu';

type HeaderProps = {
  menu: SanityDocument[] | null;
};

const Header = ({ menu }: HeaderProps) => {
  const [open, setOpen] = useState(false);

  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <div>
          <Link
            className={classes.logoLink}
            href='/'
            aria-label='Designsystem forside'
            onClick={() => setOpen(false)}
            prefetch={false}
          >
            <Image
              className={classes.logo}
              src='/img/logos/ds-positive.svg'
              alt=''
              aria-hidden='true'
              width={275}
              height={30}
            />
          </Link>
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
            {open && (
              <XMarkIcon
                fontSize={26}
                color='#1E2B3C'
              />
            )}
            {!open && (
              <MenuHamburgerIcon
                fontSize={26}
                color='#1E2B3C'
              />
            )}
          </button>
          <ul className={cl(classes.menu, { [classes.active]: open })}>
            <Menu data={menu[0].menu} />
            <li
              className={cl(classes.item, classes.itemIcon, classes.firstIcon)}
            >
              <Link
                href='https://github.com/digdir/designsystemet'
                target='_blank'
                className={cl(classes.linkIcon, classes.github)}
              >
                <GithubLogo />
              </Link>
            </li>
            <li className={cl(classes.item, classes.itemIcon)}>
              <Link
                href='https://www.figma.com/@designsystemet'
                target='_blank'
                className={cl(classes.linkIcon, classes.figma)}
              >
                <FigmaLogo />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export { Header };
