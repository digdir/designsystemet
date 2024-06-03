import type { ReactNode, HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';
import { Slot } from '@radix-ui/react-slot';

import { getColor } from '../../utilities';

type OldColors = 'first' | 'second' | 'third';

export type CardProps = {
  /**
   * Changes background & border color
   * @default neutral
   */
  color?: 'neutral' | 'subtle' | 'brand1' | 'brand2' | 'brand3' | OldColors;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
  /**
   * Changes styling if card is used as a link
   * @default false
   */
  isLink?: boolean;
  /** Instances of `Card.Header`, `Card.Content`, `Card.Footer` or other React nodes like `Divider` */
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ isLink = false, asChild = false, className, ...rest }, ref) => {
    const Component = asChild ? Slot : 'div';
    const color = getColor(rest.color || 'neutral');

    return (
      <Component
        ref={ref}
        className={cl(
          `fds-card`,
          `fds-card--${color}`,
          isLink && `fds-card--link`,
          isLink && `fds-focus`,
          className,
        )}
        {...rest}
      />
    );
  },
);

Card.displayName = 'Card';
