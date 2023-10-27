import React, { HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from './Box.module.css';

export type BoxProps = {
  /**
   * Shadow size of the box
   * @default medium
   */
  shadow?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  /**
   * Padding size of the box
   * @default medium
   */
  padding?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
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
   * @default var(--fds-semantic-background-default)
   */
  background?: string;
} & HTMLAttributes<HTMLDivElement>;

export const Box = ({
  shadow = 'medium',
  padding = 'medium',
  borderColor,
  borderRadius = 'medium',
  background = 'var(--fds-semantic-background-default)',
  children,
  ...rest
}: BoxProps) => {
  return (
    <div
      className={cn(
        classes.box,
        classes[shadow + 'Shadow'],
        classes[padding + 'Padding'],
        classes[borderRadius + 'BorderRadius'],
        borderColor && classes[borderColor + 'BorderColor'],
        rest.className,
      )}
      style={{
        background: background,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
