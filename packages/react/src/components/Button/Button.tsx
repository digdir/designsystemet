import type { ReactNode } from 'react';
import React, { forwardRef, type ButtonHTMLAttributes } from 'react';
import cn from 'classnames';

import { SvgIcon } from '../SvgIcon';
import type { OverridableComponent } from '../../types/OverridableComponent';
import utilityClasses from '../../utilities/Utility.module.css';

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
        {...rest}
        ref={ref}
        type={type}
        className={cn(
          classes.button,
          utilityClasses.focusable,
          classes[size],
          classes[variant],
          classes[color],
          { [classes.fullWidth]: fullWidth },
          { [classes.onlyIcon]: !children && icon },

          className,
        )}
      >
        {icon && iconPlacement === 'left' && (
          <SvgIcon
            svgIconComponent={icon}
            className={classes.icon}
          />
        )}
        {children}
        {icon && iconPlacement === 'right' && (
          <SvgIcon
            svgIconComponent={icon}
            className={classes.icon}
          />
        )}
      </Component>
    ),
  );
