import React, {
  forwardRef,
  type ButtonHTMLAttributes,
  type PropsWithChildren,
  ReactNode,
} from 'react';
import cn from 'classnames';

import classes from './Button.module.css';

export enum ButtonSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export enum ButtonColor {
  Primary = 'primary',
  Secondary = 'secondary',
  Success = 'success',
  Danger = 'danger',
  Inverted = 'inverted',
}

export enum ButtonVariant {
  Filled = 'filled',
  Outline = 'outline',
  Quiet = 'quiet',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  fullWidth?: boolean;
  dashedBorder?: boolean;
  icon?: ReactNode;
  iconPlacement?: 'right' | 'left';
}

const Button = (
  {
    children,
    color = ButtonColor.Primary,
    variant = ButtonVariant.Filled,
    size = ButtonSize.Small,
    fullWidth = false,
    dashedBorder = false,
    iconPlacement = 'left',
    icon,
    type = 'button',
    className,
    ...restHTMLProps
  }: PropsWithChildren<ButtonProps>,
  ref?: React.Ref<HTMLButtonElement> | undefined,
) => (
  <button
    {...restHTMLProps}
    ref={ref}
    className={cn(
      classes.button,
      classes[size],
      classes[variant],
      classes[color],
      { [classes.fullWidth]: fullWidth },
      { [classes.dashedBorder]: dashedBorder },
      { [classes.onlyIcon]: !children && icon },
      className,
    )}
    type={type}
  >
    {children}
  </button>
);

Button.displayName = 'Button';

export default forwardRef(Button);
