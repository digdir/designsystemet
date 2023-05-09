import type { ComponentPropsWithoutRef } from 'react';
import React from 'react';
import cn from 'classnames';

import classes from './List.module.css';

export type ListBorderStyle = 'solid' | 'dashed';

export type ListProps = {
  /** Select which border style between items*/
  borderStyle?: ListBorderStyle;
} & ComponentPropsWithoutRef<'ul'>;

export const List = ({
  children,
  className,
  borderStyle = 'solid',
  ...rest
}: ListProps) => (
  <ul
    {...rest}
    className={cn([classes.list, classes[borderStyle], className])}
  >
    {children}
  </ul>
);
