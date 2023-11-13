import React, { forwardRef } from 'react';
import cn from 'classnames';

import { Box, type BoxProps } from '../Box';

import classes from './Card.module.css';

export type CardProps = {
  /**
   * Variant background color of the card, undefined for no background and hover or active state
   * @default undefined
   */
  variant?: 'neutral' | 'subtle' | 'first' | 'second' | 'third';

  /**
   * Image of the card
   * @default undefined
   */
  MediaImage?: JSX.Element;

  /** Instances of `Card.Header`, `Card.Content`, `Card.Footer` or other React nodes like `Divider` */
  children: React.ReactNode;
} & Omit<BoxProps, 'background'>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      shadow,
      borderColor,
      borderRadius,
      variant,
      MediaImage,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <Box
        shadow={shadow}
        borderColor={borderColor}
        borderRadius={borderRadius}
        {...rest}
        ref={ref}
        className={cn(
          classes.card,
          { [classes[`${variant}Background`]]: !!variant },
          rest.className,
        )}
      >
        {MediaImage && MediaImage}
        {children}
      </Box>
    );
  },
);
