import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import cn from 'classnames';

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
          <h3 className={classes.title}>{SiteConfig.menu[activeIndex].name}</h3>
          <ul className={classes.list}>
            {SiteConfig.menu[activeIndex].children.map(
              (item: PageMenuItemType, index) => (
                <li
                  key={index}
                  className={cn(classes['list-group'], {
                    [classes['list-group-compact']]: !item.children,
                  })}
                >
                  {item.children && (
                    <>
                      <div className={classes['inner-title']}>{item.name}</div>
                      <ul className={classes['inner-list']}>
                        {item.children.map(
                          (item2: PageMenuItemType, index2) => (
                            <li
                              key={index2}
                              className={classes['list-item']}
                            >
                              <Link
                                href={'/' + item2.url}
                                className={cn(classes.link, {
                                  [classes['link-active']]: isItemActive(
                                    item2.url,
                                    routerPath,
                                  ),
                                })}
                              >
                                {item2.name}
                              </Link>
                            </li>
                          ),
                        )}
                      </ul>
                    </>
                  )}
                  {!item.children && (
                    <Link
                      href={'/' + item.url}
                      className={cn(classes.link, classes['link-compact'], {
                        [classes['link-active']]: isItemActive(
                          item.url,
                          routerPath,
                        ),
                      })}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ),
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export { SidebarMenu };
