import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { MenuHamburgerIcon, XMarkIcon } from '@navikt/aksel-icons';
import cn from 'classnames';

import classes from './Header.module.css';

/**
 * Function to check if the menu item should be active
 * @param routerPath - The current router path.
 * @param itemPath - The current menu item path.
 */
const isMenuItemActive = (routerPath: string, itemPath: string) => {
  return routerPath.startsWith(itemPath);
};

const Header = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const menu = [
    {
      name: 'Grunnleggende',
      url: '/grunnleggende',
    },
    {
      name: 'God praksis',
      url: '/god-praksis',
    },
    {
      name: 'Mønstre',
      url: '/monstre',
    },
    {
      name: 'Komponenter',
      url: 'https://digdir.github.io/designsystem',
    },
  ];

  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <div className={classes.left}>
          <Link
            className={classes['logo-link']}
            href='/'
          >
            <Image
              className={classes.logo}
              src='/img/logo-positive.svg'
              alt='Logo'
              width={275}
              height={30}
            />
          </Link>
        </div>
        <div className={classes.right}>
          <button
            aria-expanded={open}
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
          <ul className={cn(classes.menu, { [classes.active]: open })}>
            {menu.map((item, index) => (
              <li
                className={classes.item}
                key={index}
              >
                <Link
                  href={item.url}
                  className={cn(
                    isMenuItemActive(router.pathname, item.url)
                      ? classes.active
                      : '',
                    classes.link,
                  )}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export { Header };
