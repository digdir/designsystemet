import React, { forwardRef, type HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from '../Card.module.css';

export type CardContentProps = {
  /**
   * Justifies the direct descendants of the Card Content
   * @default flexStart
   * **/
  justifyContent?: 'flexStart' | 'flexEnd' | 'center' | 'spaceBetween';
  /**
   * Alignment of the direct descendants of Card Content
   * @default stretch
   * **/
  alignItems?: 'flexStart' | 'flexEnd' | 'center' | 'stretch' | 'baseline';
} & HTMLAttributes<HTMLDivElement>;

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  (
    {
      justifyContent = 'flexStart',
      alignItems = 'stretch',
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
        classes.column,
        classes[`${justifyContent}Justify`],
        classes[`${alignItems}Align}`],
        className,
      )}
      ref={ref}
    >
      {children}
    </div>
  ),
);
