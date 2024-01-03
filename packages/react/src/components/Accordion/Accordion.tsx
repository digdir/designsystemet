import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cl from 'clsx';

import classes from './Accordion.module.css';

export type AccordionProps = {
  /** Accordion background color */
  color?: 'first' | 'second' | 'third' | 'neutral' | 'subtle';
  /** Show border */
  border?: boolean;
  /** Instances of `Accordion.Item` */
  children: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const Accordion = forwardRef<
  HTMLDivElement,
  AccordionProps & { children: React.ReactNode }
>(({ border = false, color = 'neutral', className, ...rest }, ref) => (
  <div
    className={cl(
      classes.accordion,
      classes[color],
      {
        [classes.border]: border,
      },
      className,
    )}
    ref={ref}
    {...rest}
  />
));
