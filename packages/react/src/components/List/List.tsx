import React from 'react';

import classes from './List.module.css';

export type ListBorderStyle = 'solid' | 'dashed';

export interface ListProps {
  children?: React.ReactNode;
  borderStyle?: ListBorderStyle;
}

export const List = ({ children, borderStyle = 'solid' }: ListProps) => (
  <ul className={classes.list + ' ' + classes[borderStyle]}>{children}</ul>
);
