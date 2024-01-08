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
        iconPlacement = 'left',
        icon,
        type = 'button',
        className,
        as: Component = 'button',
        ...rest
      },
      ref,
    ) => (
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
        {icon && iconPlacement === 'left' && icon}
        {children}
        {icon && iconPlacement === 'right' && icon}
      </Component>
    ),
  );
