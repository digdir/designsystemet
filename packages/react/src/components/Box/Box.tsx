import React, { HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from './Box.module.css';

export type BoxProps = {
  shadow?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
} & HTMLAttributes<HTMLDivElement>;

export const Box = ({
  shadow = 'xs',
  padding = 'md',
  children,
  ...rest
}: BoxProps) => {
  return <div className={cn(classes.box, rest.className)}>{children}</div>;
};
