import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';
import { Slot } from '@radix-ui/react-slot';

import { getSize } from '../../utilities/getSize';

type OldShadowSizes = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
type OldBorderRadii =
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | 'xxlarge'
  | 'xxxlarge'
  | 'xxxxlarge';

export type BoxProps = {
  /**
   * Shadow size of the box
   * @default undefined
   */
  shadow?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | OldShadowSizes;
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
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | 'full'
    | OldBorderRadii;
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
    const shadowSize = shadow && getSize(shadow);
    const borderRadiusSize = borderRadius && getSize(borderRadius);

    return (
      <Component
        ref={ref}
        className={cl(
          shadowSize && `fds-box--${shadowSize}-shadow`,
          borderColor && `fds-box--${borderColor}-border-color`,
          borderRadiusSize && `fds-box--${borderRadiusSize}-border-radius`,
          `fds-box--${background}-background`,
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
