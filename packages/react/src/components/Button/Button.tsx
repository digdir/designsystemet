import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import cl from 'clsx/lite';
import { Slot } from '@radix-ui/react-slot';

import { getColor, getSize } from '../../utilities';

type OldButtonSizes = 'small' | 'medium' | 'large';
type OldColors = 'first' | 'second' | 'success';

export type ButtonProps = {
  /** Specify which variant to use */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /** Specify which color palette to use
   * @default accent
   * @note `first`, `second`, `success` is deprecated
   */
  color?: 'accent' | 'neutral' | 'danger' | OldColors;
  /**
   * Size
   * @default md
   * @note `small`, `medium`, `large` is deprecated
   */
  size?: 'sm' | 'md' | 'lg' | OldButtonSizes;
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
    const color = getColor(rest.color || 'accent', 'action');
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
