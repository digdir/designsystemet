import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import cl from 'clsx';
import { Slot } from '@radix-ui/react-slot';

import type { OverridableComponent } from '../../types/OverridableComponent';

import classes from './Button.module.css';

export type ButtonProps = {
  /** Specify which variant to use */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /** Specify which color palette to use */
  color?: 'first' | 'second' | 'success' | 'danger' | 'inverted';
  /** Size */
  size?: 'small' | 'medium' | 'large';
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
export const Button: OverridableComponent<ButtonProps, HTMLButtonElement> =
  forwardRef(
    (
      {
        children,
        color = 'first',
        variant = 'primary',
        size = 'medium',
        fullWidth = false,
        icon = false,
        type = 'button',
        className,
        as = 'button',
        asChild,
        ...rest
      },
      ref,
    ) => {
      const Component = asChild ? Slot : as;

      return (
        <Component
          ref={ref}
          type={type}
          className={cl(
            classes.button,
            `fds-utilities--focusable`,
            classes[size],
            classes[variant],
            classes[color],
            { [classes.fullWidth]: fullWidth },
            { [classes.onlyIcon]: icon },
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
