'use client';
import { Button, Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { SiteConfig } from '../../siteConfig';
import type { PageMenuItemType } from '../../utils/menus/PageMenu';

import classes from './SidebarMenu.module.css';
interface SidebarMenuProps {
  routerPath: string;
}

/** Check if item path in menu is equal to the activeRouterPath */
const isItemActive = (path: string, activeRouterPath: string) => {
  return '/' + path === activeRouterPath;
};

const SidebarMenu = ({ routerPath }: SidebarMenuProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    findAndSetActiveIndex(routerPath);
  }, [routerPath]);

  /** Find at what index in the menu tree */
  const findAndSetActiveIndex = (path: string) => {
    for (let i = 0; i < SiteConfig.menu.length; i++) {
      if (SiteConfig.menu[i].url === path.split('/')[1]) {
        setActiveIndex(i);
      }
    }
  };

  return (
    <div>
      {activeIndex >= 0 && (
        <>
          <Button
            className={classes.toggleBtn}
            data-size='md'
            color='neutral'
            variant='secondary'
            onClick={() => setShowMenu(!showMenu)}
            aria-expanded={showMenu}
          >
            {showMenu ? 'Skjul' : 'Vis'} sidemeny
          </Button>

          <div className={cl(classes.menu, showMenu && classes.activeMenu)}>
            <Paragraph data-size='md' asChild>
              <h3 className={classes.title}>
                {SiteConfig.menu[activeIndex].name}
              </h3>
            </Paragraph>
            <ul className={classes.list}>
              {SiteConfig.menu[activeIndex].children.map(
                (item: PageMenuItemType, index) => (
                  <li
                    key={index}
                    className={cl(classes.listGroup, {
                      [classes.listGroupCompact]: !item.children,
                    })}
                  >
                    {item.children && (
                      <>
                        <Paragraph asChild data-size='md'>
                          <div className={classes.innerTitle}>{item.name}</div>
                        </Paragraph>
                        <ul className={classes.innerList}>
                          {item.children.map(
                            (item2: PageMenuItemType, index2) => (
                              <li key={index2} className={classes.listItem}>
                                <Paragraph asChild data-size='sm'>
                                  <Link
                                    href={'/' + item2.url}
                                    prefetch={false}
                                    className={cl(
                                      classes.link,
                                      isItemActive(item2.url, routerPath) &&
                                        classes.linkActive,
                                    )}
                                  >
                                    {item2.name}
                                  </Link>
                                </Paragraph>
                              </li>
                            ),
                          )}
                        </ul>
                      </>
                    )}
                    {!item.children && (
                      <Paragraph asChild data-size='sm'>
                        <Link
                          href={'/' + item.url}
                          prefetch={false}
                          className={cl(
                            classes.link,
                            classes.linkCompact,
                            isItemActive(item.url, routerPath) &&
                              classes.linkActive,
                          )}
                        >
                          {item.name}
                        </Link>
                      </Paragraph>
                    )}
                  </li>
                ),
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export { SidebarMenu };
