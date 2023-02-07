import React from 'react';

import { Tag } from '../Tag/Tag';

import classes from './SidebarMenu.module.css';

interface SidebarMenuProps {
  title: string;
}

const SidebarMenu = ({ title }: SidebarMenuProps) => {
  return (
    <div className={classes.menu}>
      <h3 className={classes.title}>{title}</h3>
      <ul className={classes.list}>
        <li className={classes.item}>
          <a
            className={classes.link}
            href='#'
          >
            Accordion{' '}
            <Tag
              color='purple'
              type='beta'
            />
          </a>
        </li>
        <li className={classes.item}>
          <a
            className={classes.link}
            href='#'
          >
            Button
          </a>
        </li>
        <li className={classes.item}>
          <a
            className={classes.link}
            href='#'
          >
            Link{' '}
            <Tag
              color='deprecated'
              type='deprecated'
            />
          </a>
        </li>
        <li className={classes.item}>
          <a
            className={classes.link}
            href='#'
          >
            Header
          </a>
        </li>
        <li className={classes.item}>
          <a
            className={classes.link}
            href='#'
          >
            Toolbar
          </a>
        </li>
      </ul>
    </div>
  );
};

export { SidebarMenu };
