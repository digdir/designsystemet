import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Spinner } from '../Spinner';
import { Paragraph } from '../Typography';

export type ButtonProps = {
  /**
   * Specify which variant to use
   * @default primary
   */
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
  /**
   * If `Button` should fill width of its container
   * @default false
   */
  fullWidth?: boolean;
  /** Toggle icon only styling, pass icon as children
   * @default false
   */
  icon?: boolean;
  /** Toggle loading state
   * @default false
   */
  loading?: boolean;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Button used for interaction
 * @example
 * <Button>Click me</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      asChild,
      className,
      children,
      color = 'accent',
      fullWidth = false,
      icon = false,
      loading = false,
      size = 'md',
      type = 'button',
      variant = 'primary',
      ...rest
    },
    ref,
  ) {
    const Component = asChild ? Slot : 'button';
    const spinnerColor = color === 'accent' ? color : 'neutral';

    return (
      <Paragraph variant='short' size={size} asChild>
        <Component
          aria-busy={Boolean(loading) || undefined} // Fallback to undefined to prevent false from rendering aria-busy="false"
          className={cl('ds-button', className)}
          data-ds-color={color}
          data-ds-fullwidth={fullWidth || undefined} // Fallback to undefined to prevent false from rendering data-ds-fill="false"
          data-ds-icon={icon || undefined} // Fallback to undefined to prevent false from rendering data-ds-icon="false"}
          data-ds-size={size}
          data-ds-variant={variant}
          ref={ref}
          type={type}
          {...rest}
        >
          {loading === true ? (
            <Spinner size='sm' color={spinnerColor} title='' />
          ) : (
            loading // Allow custom loading spinner
          )}
          {children}
        </Component>
      </Paragraph>
    );
  },
);
