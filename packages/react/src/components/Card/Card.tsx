import type { ReactNode, HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';
import { Slot } from '@radix-ui/react-slot';

export type CardProps = {
  /**
   * Changes background & border color
   * @default neutral
   */
  color?: 'neutral' | 'subtle' | 'brand1' | 'brand2' | 'brand3';
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
  (
    { isLink = false, asChild = false, color = 'neutral', className, ...rest },
    ref,
  ) => {
    const Component = asChild ? Slot : 'div';
    return (
      <Component
        ref={ref}
        className={cl(
          `ds-card`,
          `ds-card--${color}`,
          isLink && `ds-card--link`,
          isLink && `ds-focus`,
          className,
        )}
        {...rest}
      />
    );
  },
);

Card.displayName = 'Card';
