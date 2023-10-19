import type { HTMLAttributes, ReactNode } from 'react';
import React, { useId } from 'react';
import cn from 'classnames';

import { Heading, Paragraph } from '../Typography';

import classes from './List.module.css';

export type ListProps = {
  /**
   * The type of list to render.
   * @default ul
   */
  as?: 'ul' | 'ol';
  /** Changes text sizing
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Heading above the list
   */
  heading?: string;
  /**
   * Level of the heading
   * @default 2
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

export const List = ({
  children,
  className,
  as = 'ul',
  size = 'medium',
  heading,
  headingLevel = 2,
  ...rest
}: ListProps) => {
  const headingId = useId();

  return (
    <>
      {heading && (
        <Heading
          size={size}
          level={headingLevel}
          id={headingId}
        >
          {heading}
        </Heading>
      )}
      <Paragraph
        as={as}
        size={size}
        className={cn(classes.list, className)}
        role='list'
        {...(heading ? { 'aria-labelledby': headingId } : {})}
        {...rest}
      >
        {children}
      </Paragraph>
    </>
  );
};
