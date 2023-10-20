import type { HTMLAttributes, ReactNode } from 'react';
import React, { useId, useMemo } from 'react';
import cn from 'classnames';

import { Heading, Paragraph } from '../Typography';

import classes from './List.module.css';

const HEADING_SIZE_MAP = {
  small: 'xxsmall',
  medium: 'xsmall',
  large: 'small',
} as const;

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
  heading?: ReactNode;
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

  const headingSize = useMemo(() => HEADING_SIZE_MAP[size], [size]);

  return (
    <>
      {heading && (
        <Heading
          size={headingSize}
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
