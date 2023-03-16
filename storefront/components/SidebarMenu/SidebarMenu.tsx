import React from 'react';
import Link from 'next/link';
import cn from 'classnames';

import {
  capitalizeString,
  convertQueryToReadable,
  removeStringExtension,
  convertMenuItemToRelativePath,
  replaceBackSlashWithForwardSlash,
} from '../../utils/StringHelpers';
import type {
  PageMenuDataType,
  PageMenuItemType,
} from '../../utils/menus/PageMenu';

import classes from './SidebarMenu.module.css';

interface SidebarMenuProps {
  title: string;
  menu: PageMenuDataType;
  activeRouterPath: string;
}

/** Convert name given from MenuTree to a readable name */
const getListItemName = (name: string) => {
  return convertQueryToReadable(capitalizeString(removeStringExtension(name)));
};
/** Convert path given from MenuTree to relative path with no file extension */
const getListItemPath = (path: string) => {
  return convertMenuItemToRelativePath(
    removeStringExtension(replaceBackSlashWithForwardSlash(path)),
  );
};
/** Check if item path in menu is equal to the activeRouterPath */
const isItemActive = (path: string, activeRouterPath: string) => {
  return getListItemPath(path) === activeRouterPath;
};

const SidebarMenu = ({ title, menu, activeRouterPath }: SidebarMenuProps) => {
  return (
    <div className={classes.menu}>
      <h3 className={classes.title}>
        {convertQueryToReadable(capitalizeString(title))}
      </h3>

      {menu.children && (
        <ul className={classes.list}>
          {menu.children.map((item: PageMenuItemType, index) => (
            <li
              key={index}
              className={cn(classes['list-group'], {
                [classes['list-group-compact']]: !item.children,
              })}
            >
              {item.children && (
                <>
                  <div className={classes['inner-title']}>
                    {convertQueryToReadable(capitalizeString(item.name))}
                  </div>
                  <ul className={classes['inner-list']}>
                    {item.children.map((item2: PageMenuItemType, index2) => (
                      <li
                        key={index2}
                        className={classes['list-item']}
                      >
                        <Link
                          href={getListItemPath(item2.path)}
                          className={cn(classes.link, {
                            [classes['link-active']]: isItemActive(
                              item2.path,
                              activeRouterPath,
                            ),
                          })}
                        >
                          {getListItemName(item2.name)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {!item.children && (
                <Link
                  href={getListItemPath(item.path)}
                  className={cn(classes.link, classes['link-compact'], {
                    [classes['link-active']]: isItemActive(
                      item.path,
                      activeRouterPath,
                    ),
                  })}
                >
                  {getListItemName(item.name)}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { SidebarMenu };
