import type { ElementType, HTMLAttributes } from 'react';
import React from 'react';
import cn from 'classnames';

import classes from './Box.module.css';

export type BoxProps = {
  /**
   * The element to render as
   */
  as?: ElementType;
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
  borderRadius?: 'small' | 'medium' | 'large';
  /**
   * Background color of the box
   * @default 'defualt'
   */
  background?: 'default' | 'subtle';
} & HTMLAttributes<HTMLDivElement>;

export const Box = ({
  as: Component = 'div',
  shadow,
  borderColor,
  borderRadius,
  background = 'default',
  children,
  ...rest
}: BoxProps) => {
  return (
    <Component
      {...rest}
      className={cn(
        classes.box,
        shadow && classes[shadow + 'Shadow'],
        borderRadius && classes[borderRadius + 'BorderRadius'],
        borderColor && classes[borderColor + 'BorderColor'],
        classes[background + 'Background'],
        rest.className,
      )}
    >
      {children}
    </Component>
  );
};
