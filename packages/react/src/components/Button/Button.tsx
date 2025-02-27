import type {
  Color,
  SeverityDanger,
} from '@digdir/designsystemet-react/colors';
import { Slot, Slottable } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
import { Spinner } from '../Spinner';

export type ButtonProps = MergeRight<
  DefaultProps & ButtonHTMLAttributes<HTMLButtonElement>,
  {
    /**
     * Specify which variant to use
     * @default 'primary'
     */
    variant?: 'primary' | 'secondary' | 'tertiary';
    /**
     * Change the color scheme of the button
     */
    'data-color'?: Color | SeverityDanger;
    /**
     * Toggle icon only styling, pass icon as children
     * @default false
     */
    icon?: boolean;
    /**
     * Toggle loading state.
     * Pass an element if you want to display a custom loader.
     *
     * @default false
     */
    loading?: boolean | ReactNode;
    /**
     * Change the default rendered element for the one passed as a child, merging their props and behavior.
     * @default false
     */
    asChild?: boolean;
    /**
     * Specify the type of button. Unset when `asChild` is true
     * @default 'button'
     */
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  }
>;

/**
 * Button used for interaction
 *
 * @example
 * <Button>Click me</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      asChild,
      className,
      children,
      icon = false,
      loading = false,
      variant = 'primary',
      ...rest
    },
    ref,
  ) {
    const Component = asChild ? Slot : 'button';

    // Fallbacks to undefined to prevent rendering attribute="false"
    return (
      <Component
        aria-busy={Boolean(loading) || undefined}
        aria-disabled={Boolean(loading) || undefined}
        className={cl('ds-button', className)}
        data-icon={icon || undefined}
        data-variant={variant}
        ref={ref}
        /* don't set type when we use `asChild` */
        type={asChild ? undefined : 'button'}
        /* if consumers set type, our default does not set anything, as `rest` contains this */
        {...rest}
      >
        {loading === true ? (
          <Spinner aria-hidden='true' />
        ) : (
          loading // Allow custom loading spinner
        )}
        <Slottable>{children}</Slottable>
      </Component>
    );
  },
);
