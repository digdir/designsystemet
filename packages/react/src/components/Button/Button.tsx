import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import cl from 'clsx/lite';
import { Slot } from '@radix-ui/react-slot';

import { Paragraph } from '../Typography';

export type ButtonProps = {
  /** Specify which variant to use */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /** Specify which color palette to use
   * @default accent
   */
  color?: 'accent' | 'neutral' | 'danger';
  /**
   * Size
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
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
      color = 'accent',
      fullWidth = false,
      icon = false,
      type = 'button',
      size = 'md',
      asChild,
      className,
      ...rest
    },
    ref,
  ) => {
    const Component = asChild ? Slot : 'button';

    return (
      <Paragraph
        variant='short'
        size={size}
        asChild
      >
        <Component
          ref={ref}
          type={type}
          className={cl(
            'ds-btn',
            `ds-focus`,
            `ds-btn--${size}`,
            `ds-btn--${variant}`,
            `ds-btn--${color}`,
            fullWidth && 'ds-btn--full-width',
            icon && 'ds-btn--icon-only',
            className,
          )}
          {...rest}
        >
          {children}
        </Component>
      </Paragraph>
    );
  },
);

Button.displayName = 'Button';
