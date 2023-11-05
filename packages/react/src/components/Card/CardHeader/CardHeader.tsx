import React, { forwardRef, type HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from '../Card.module.css';

export type CardHeaderProps = {
  /**
   * Justifies the direct descendants of the Card Header
   * @default spaceBetween
   * **/
  justifyContent?: 'flexStart' | 'flexEnd' | 'center' | 'spaceBetween';
  /**
   * Alignment of the direct descendants of Header
   * @default center
   * **/
  alignItems?: 'flexStart' | 'flexEnd' | 'center' | 'stretch' | 'baseline';
  /** Adds a divider to the bottom of the Card Header
   * @default false
   **/
  divided?: boolean;
  /**
   * Adds a link to the Card Header title
   */
  href?: string;
} & HTMLAttributes<HTMLDivElement>;

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    {
      divided = false,
      alignItems = 'center',
      justifyContent = 'spaceBetween',
      className,
      children,
      ...rest
    },
    ref,
  ) => (
    <div
      {...rest}
      className={cn(
        classes.section,
        classes[`${alignItems}Align`],
        classes[`${justifyContent}Justify`],
        { [classes.headerDivided]: divided },
        className,
      )}
      ref={ref}
    >
      {children}
    </div>
  ),
);
