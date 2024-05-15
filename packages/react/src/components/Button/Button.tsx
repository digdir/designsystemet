import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import cl from 'clsx/lite';
import { Slot } from '@radix-ui/react-slot';

import { getSize } from '../../utilities/getSize';

type OldButtonSize = 'small' | 'medium' | 'large';

export type ButtonProps = {
  /** Specify which variant to use */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /** Specify which color palette to use */
  color?: 'first' | 'second' | 'success' | 'danger';
  /**
   * Size
   * @default md
   *
   * @note Use `sm`, `md`, `lg` instead of `small`, `medium`, `large`, as the latter will be deprecated
   */
  size?: 'sm' | 'md' | 'lg' | OldButtonSize;
  /** If `Button` should fill full width of its container */
  fullWidth?: boolean;
  /** Toggle icon only styling, pass icon as children
   * @default false
   */
  icon?: boolean;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Button used for interaction
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      color = 'first',
      variant = 'primary',
      fullWidth = false,
      icon = false,
      type = 'button',
      className,
      asChild,
      ...rest
    },
    ref,
  ) => {
    const size = getSize(rest.size || 'md');
    const Component = asChild ? Slot : 'button';

    return (
      <Component
        ref={ref}
        type={type}
        className={cl(
          'fds-btn',
          `fds-focus`,
          `fds-btn--${size}`,
          `fds-btn--${variant}`,
          `fds-btn--${color}`,
          fullWidth && 'fds-btn--full-width',
          icon && 'fds-btn--icon-only',
          className,
        )}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

Button.displayName = 'Button';
