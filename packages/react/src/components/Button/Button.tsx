import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { forwardRef } from 'react';

export type ButtonProps = {
  /**
   * Specify which variant to use
   * @default primary
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /** Specify which color to use
   * @default accent
   */
  color?: 'accent' | 'neutral' | 'danger';
  /**
   * Size
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * If `Button` should fill width of its container
   * @default false
   */
  fill?: boolean;
  /** Toggle icon only styling, pass icon as children
   * @default false
   */
  icon?: boolean;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Button used for interaction
 * @example
 * <Button>Click me</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      // icon = false,
      asChild,
      className,
      color = 'accent',
      fill = false,
      size = 'md',
      type = 'button',
      variant = 'primary',
      ...rest
    },
    ref,
  ) {
    const Component = asChild ? Slot : 'button';

    return (
      <Component
        className={cl('ds-button', className)}
        data-color={color}
        data-fill={fill || undefined} // Fallback to undefined to prevent false from rendering data-fill="false"
        data-size={size}
        data-variant={variant}
        ref={ref}
        type={type}
        {...rest}
      />
    );
  },
);
