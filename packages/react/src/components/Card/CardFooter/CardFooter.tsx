import React, { forwardRef, type HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from '../Card.module.css';

export type CardFooterProps = {
  /**
   * Justifies the direct descendants of the Card Footer
   * @default spaceBetween
   * **/
  justifyContent?: 'flexStart' | 'flexEnd' | 'center' | 'spaceBetween';
  /**
   * Alignment of the direct descendants of Card Footer
   * @default center
   * **/
  alignItems?: 'flexStart' | 'flexEnd' | 'center' | 'stretch' | 'baseline';
  /** Adds a divider to the top of the Card Footer
   * @default false
   **/
  divided?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  (
    {
      divided = false,
      justifyContent = 'spaceBetween',
      alignItems = 'center',
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
        classes[`${justifyContent}Justify`],
        classes[`${alignItems}Align`],
        { [classes.footerDivided]: divided },
        className,
      )}
      ref={ref}
    >
      {children}
    </div>
  ),
);
