import type { ComponentPropsWithoutRef } from 'react';
import React from 'react';
import cn from 'classnames';

import classes from './List.module.css';

export type ListProps = {
  /** Select which border style between items*/
  borderStyle?: 'solid' | 'dashed';
} & ComponentPropsWithoutRef<'ul'>;

export const List = ({
  borderStyle = 'solid',
  children,
  className,
  ...rest
}: ListProps) => (
  <ul
    {...rest}
    className={cn([classes.list, classes[borderStyle], className])}
  >
    {children}
  </ul>
);
