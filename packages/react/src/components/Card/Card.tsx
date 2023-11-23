import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { Box } from '../Box';

import classes from './Card.module.css';

export type CardProps = {
  /**
   * Variant background color of the card, undefined for no background and hover or active state
   * @default neutral
   */
  color?: 'neutral' | 'subtle' | 'first' | 'second' | 'third';

  /**
   * Image of the card
   * @default undefined
   */
  MediaImage?: JSX.Element;

  /** Instances of `Card.Header`, `Card.Content`, `Card.Footer` or other React nodes like `Divider` */
  children: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ color = 'neutral', MediaImage, children, ...rest }, ref) => {
    return (
      <Box
        borderColor='default'
        borderRadius='medium'
        {...rest}
        ref={ref}
        className={cn(classes.card, classes[color], rest.className)}
      >
        {MediaImage && MediaImage}
        {children}
      </Box>
    );
  },
);
