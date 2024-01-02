import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cl from 'clsx';

import type { OverridableComponent } from '../../types/OverridableComponent';

import classes from './Box.module.css';

export type BoxProps = {
  /**
   * Shadow size of the box
   * @default undefined
   */
  shadow?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  /**
   * Border color of the box
   * @default undefined
   */
  borderColor?: 'default' | 'subtle' | 'strong';
  /**
   * Border radius of the box
   * @default undefined
   */
  borderRadius?:
    | 'small'
    | 'medium'
    | 'large'
    | 'xlarge'
    | 'xxlarge'
    | 'xxxlarge'
    | 'xxxxlarge'
    | 'full';
  /**
   * Background color of the box
   * @default 'default'
   */
  background?: 'default' | 'subtle';
} & HTMLAttributes<HTMLDivElement>;

export const Box: OverridableComponent<BoxProps, HTMLDivElement> = forwardRef(
  (
    {
      shadow,
      borderColor,
      borderRadius,
      background = 'default',
      children,
      as: Component = 'div',
      ...rest
    },
    ref,
  ) => (
    <Component
      {...rest}
      ref={ref}
      className={cl(
        shadow && classes[shadow + 'Shadow'],
        borderRadius && classes[borderRadius + 'BorderRadius'],
        borderColor && classes[borderColor + 'BorderColor'],
        classes[background + 'Background'],
        rest.className,
      )}
    >
      {children}
    </Component>
  ),
);
