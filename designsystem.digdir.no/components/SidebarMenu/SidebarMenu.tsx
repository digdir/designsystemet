import React from 'react';
import Link from 'next/link';
import cn from 'classnames';

import { Tag } from '../Tag/Tag';
import { capitalizeString } from '../../utils/StringHelpers';

import classes from './SidebarMenu.module.css';

interface SidebarMenuProps {
  title: string;
  items: any;
}

const SidebarMenu = ({ title, items }: SidebarMenuProps) => {
  return (
    <div className={classes.menu}>
      <h3 className={classes.title}>{title}</h3>

      {items.length && (
        <ul className={classes.list}>
          {items.map((item: any, index: number) => (
            <li
              key={index}
              className={cn(classes.item, { [classes.active]: item.active })}
            >
              <Link
                className={classes.link}
                href={'/' + item.url}
              >
                {capitalizeString(item.title)}
                {item.status === 'beta' && (
                  <Tag
                    color='purple'
                    type='beta'
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { SidebarMenu };
