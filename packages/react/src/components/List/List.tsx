import type { HTMLAttributes, ReactNode } from 'react';
import React from 'react';
import cn from 'classnames';

import { Paragraph } from '../Typography';

import classes from './List.module.css';

export type ListProps = {
  /**
   * The type of list to render.
   * @default ul
   */
  component?: 'ul' | 'ol';
  /** Changes text sizing
   * @default medium
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

export const List = ({
  children,
  className,
  component = 'ul',
  size = 'medium',
  ...rest
}: ListProps) => (
  <Paragraph
    as={component}
    size={size}
    className={cn([classes.list, className])}
    role='list'
    {...rest}
  >
    {children}
  </Paragraph>
);
