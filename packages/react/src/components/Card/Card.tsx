import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { Box } from '../Box';

import classes from './Card.module.css';

export type CardProps = {
  /**
   * Changes background & border color
   * @default neutral
   */
  color?: 'neutral' | 'subtle' | 'first' | 'second' | 'third';

  /** Instances of `Card.Header`, `Card.Content`, `Card.Footer` or other React nodes like `Divider` */
  children: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ color = 'neutral', children, ...rest }, ref) => {
    return (
      <Box
        borderRadius='medium'
        {...rest}
        ref={ref}
        className={cn(classes.card, classes[color], rest.className)}
      >
        {children}
      </Box>
    );
  },
);
