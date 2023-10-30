import React, { forwardRef, type HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from '../Card.module.css';

export type CardSectionProps = {
  /** Sets `direction` of the Card Layer. */
  direction?: 'row' | 'column';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  alignItems?:
    | 'align-flex-start'
    | 'align-center'
    | 'align-flex-end'
    | 'align-stretch'
    | 'align-baseline';
  /** Instances of `Card.Section` */
  children: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const CardSection = forwardRef<HTMLDivElement, CardSectionProps>(
  (
    {
      direction = 'column',
      justifyContent = 'flex-start',
      alignItems = 'align-stretch',
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
        classes[direction],
        classes[justifyContent],
        classes[alignItems],
        className,
      )}
      ref={ref}
    >
      {children}
    </div>
  ),
);
