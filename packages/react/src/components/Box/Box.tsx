import React, { ElementType, HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from './Box.module.css';

export type BoxProps = {
  /**
   * The element to render as
   */
  as?: ElementType;
  /**
   * Shadow size of the box
   * @default medium
   */
  shadow?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  /**
   * Border color of the box
   * @default undefined
   */
  borderColor?: 'default' | 'sublte';
  /**
   * Border radius of the box
   * @default medium
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
  shadow = 'medium',
  borderColor,
  borderRadius = 'medium',
  background = 'default',
  children,
  ...rest
}: BoxProps) => {
  return (
    <Component
      className={cn(
        classes.box,
        classes[shadow + 'Shadow'],
        classes[borderRadius + 'BorderRadius'],
        borderColor && classes[borderColor + 'BorderColor'],
        classes[background + 'Background'],
        rest.className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};
