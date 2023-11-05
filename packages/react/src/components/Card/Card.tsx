import React, { type HTMLAttributes, forwardRef } from 'react';
import cn from 'classnames';

import { Box } from '../Box';

import classes from './Card.module.css';

export type CardProps = {
  /**
   * Shadow size of the card
   * @default undefined
   */
  shadow?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  /**
   * Border width of the card
   * @default undefined
   */
  border?: 'default' | 'subtle' | 'strong';
  /**
   * Border radius of the card
   * @default undefined
   */
  borderRadius?: 'small' | 'medium' | 'large';
  /**
   * Variant background color of the card, undefined for no background and hover or active state
   * @default undefined
   */
  variant?: 'neutral' | 'subtle' | 'first' | 'second' | 'third';

  /**
   * Image url of the card
   * @default undefined
   */
  mediaImage?: string;

  /** Instances of `Card.Header`, `Card.Content` or `Card.Footer` */
  children: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { shadow, border, borderRadius, variant, mediaImage, children, ...rest },
    ref,
  ) => {
    return (
      <Box
        shadow={shadow}
        borderColor={border}
        borderRadius={borderRadius}
        {...rest}
        ref={ref}
        className={cn(
          classes.card,
          { [classes[`${variant}Background`]]: !!variant },
          rest.className,
        )}
      >
        {mediaImage && (
          <img
            src={mediaImage}
            alt='cat'
          />
        )}
        {children}
      </Box>
    );
  },
);
