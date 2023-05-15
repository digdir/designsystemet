import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import classes from './Accordion.module.css';

export type AccordionProps = {
  /** Accordion background color */
  color?: 'neutral' | 'subtle' | 'primary' | 'secondary' | 'tertiary';
  /** Show border */
  border?: boolean;
  /** Instances of Accordion.Item */
  children: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ border = false, color = 'neutral', className, ...rest }, ref) => (
    <div
      {...rest}
      className={cn(
        classes.accordion,
        classes[color],
        {
          [classes.border]: border,
        },
        className,
      )}
      ref={ref}
    />
  ),
);
