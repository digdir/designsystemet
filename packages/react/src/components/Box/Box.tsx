import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx';
import { Slot } from '@radix-ui/react-slot';

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
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      shadow,
      borderColor,
      borderRadius,
      background = 'default',
      children,
      asChild = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        ref={ref}
        className={cl(
          shadow && classes[shadow + 'Shadow'],
          borderRadius && classes[borderRadius + 'BorderRadius'],
          borderColor && classes[borderColor + 'BorderColor'],
          classes[background + 'Background'],
          className,
        )}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

Box.displayName = 'Box';
