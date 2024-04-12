import type { ReactNode, HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx';
import { Slot } from '@radix-ui/react-slot';

import type { OverridableComponent } from '../../types/OverridableComponent';

import classes from './Card.module.css';

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

export const Card: OverridableComponent<CardProps, HTMLDivElement> = forwardRef(
  (
    {
      color = 'neutral',
      as = 'div',
      isLink = false,
      asChild = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const Component = asChild ? Slot : as;

    return (
      <Component
        ref={ref}
        className={cl(
          classes.card,
          classes[color],
          isLink && classes.linkCard,
          isLink && `fds-utilities--focusable`,
          className,
        )}
        {...rest}
      />
    );
  },
);

Card.displayName = 'Card';
