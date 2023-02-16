import React from 'react';

import classes from './ListItem.module.css';

export interface ListItemProps {
  children?: React.ReactNode;
}

export const ListItem = ({ children }: ListItemProps) =>  (
  <li className={classes.listItem}>
    {children}
  </li>
);
