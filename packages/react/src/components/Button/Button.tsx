import React, { forwardRef } from 'react';
import type { ReactNode, ButtonHTMLAttributes } from 'react';
import cl from 'clsx';
import { Slot } from '@radix-ui/react-slot';

import utilityClasses from '../../utilities/utility.module.css';
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
  /** Icon to be rendered in the button. This should be a React component that renders an SVG object. */
  icon?: ReactNode;
  /** Icon position inside Button */
  iconPlacement?: 'right' | 'left';
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
        icon,
        type = 'button',
        className,
        as = 'button',
        asChild = false,
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
            utilityClasses.focusable,
            classes[size],
            classes[variant],
            classes[color],
            { [classes.fullWidth]: fullWidth },
            { [classes.onlyIcon]: !children && icon },
            className,
          )}
          {...rest}
        >
          {children}
        </Component>
      );
    },
  );

export const ButtonIcon = ({ children }: { children: ReactNode }) => {
  return <Slot className={classes.icon}>{children}</Slot>;
};

Button.displayName = 'Button.Icon';
