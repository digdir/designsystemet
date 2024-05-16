import type { ReactNode, HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';
import { Slot } from '@radix-ui/react-slot';

export type CardProps = {
  /**
   * Changes background & border color
   * @default neutral
   */
  color?: 'neutral' | 'subtle' | 'first' | 'second' | 'third';
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

  /**
   * @deprecated Use `asChild` and `isLink={true}` instead
   */
  href?: never;
} & HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { color = 'neutral', isLink = false, asChild = false, className, ...rest },
    ref,
  ) => {
    const Component = asChild ? Slot : 'div';

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
