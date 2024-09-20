import { Slot, Slottable } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Paragraph, Spinner } from '../';

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
  /**
   * Specify the type of button. Unset when `asChild` is true
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
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
      icon = false,
      loading = false,
      size = 'md',
      variant = 'primary',
      type,
      ...rest
    },
    ref,
  ) {
    const Component = asChild ? Slot : 'button';
    const spinnerColor = color === 'accent' ? color : 'neutral';

    // Fallbacks to undefined to prevent rendering attribute="false"
    return (
      <Paragraph variant='short' size={size} asChild>
        <Component
          aria-busy={Boolean(loading) || undefined}
          className={cl('ds-button', className)}
          data-color={color}
          data-icon={icon || undefined}
          data-size={size}
          data-variant={variant}
          ref={ref}
          /* don't set type when we use `asChild` */
          {...(asChild ? { asChild: true, type } : { type: type ?? 'button' })}
          {...rest}
        >
          {loading === true ? (
            <Spinner
              aria-hidden='true'
              color={spinnerColor}
              size='sm'
              title=''
            />
          ) : (
            loading // Allow custom loading spinner
          )}
          <Slottable>{children}</Slottable>
        </Component>
      </Paragraph>
    );
  },
);
