import React from 'react';
import Link from 'next/link';
import cn from 'classnames';

import {
  capitalizeString,
  convertQueryToReadable,
  removeStringExtension,
  convertMenuItemToRelativePath,
} from '../../utils/StringHelpers';

import classes from './SidebarMenu.module.css';

interface SidebarMenuProps {
  title: string;
  menu: {
    children: MenuItem[];
  };
}

interface MenuItem {
  name: string;
  path: string;
  children: MenuItem[];
}

const SidebarMenu = ({ title, menu }: SidebarMenuProps) => {
  const getListItemName = (name: string) => {
    return convertQueryToReadable(
      capitalizeString(removeStringExtension(name)),
    );
  };
  const getListItemPath = (path: string) => {
    return convertMenuItemToRelativePath(removeStringExtension(path));
  };

  return (
    <div className={classes.menu}>
      <h3 className={classes.title}>
        {convertQueryToReadable(capitalizeString(title))}
      </h3>

      {menu.children && (
        <ul className={classes.list}>
          {menu.children.map((item: MenuItem, index) => (
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
                    {item.children &&
                      item.children.map((item2: MenuItem, index2) => (
                        <li
                          key={index2}
                          className={classes['list-item']}
                        >
                          <Link
                            href={getListItemPath(item2.path)}
                            className={classes.link}
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
                  className={cn(classes.link, classes['link-compact'])}
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
