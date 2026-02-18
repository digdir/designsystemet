import type { Color, SeverityColors } from '@digdir/designsystemet-types';
import { Slot, Slottable } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef, version } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
import { Spinner } from '../spinner/spinner';

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
    'data-color'?: Color | Extract<SeverityColors, 'danger'>;
    /**
     * Toggle icon only styling, pass icon as children
     * When combined with loading, the loading-icon will be shown instead of the icon.
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
      popoverTarget,
      popovertarget,
      ...rest
    },
    ref,
  ) {
    const Component = asChild ? Slot : 'button';
    const popoverVal = popoverTarget ?? popovertarget;
    const popoverKey = version.startsWith('19')
      ? 'popoverTarget'
      : 'popovertarget';

    // Fallbacks to undefined to prevent rendering attribute="false"
    return (
      <Component
        suppressHydrationWarning // Might get augmented through designsystemet-web with aria-haspopup etc.
        aria-busy={Boolean(loading) || undefined}
        aria-disabled={Boolean(loading) || undefined}
        className={cl('ds-button', className)}
        data-icon={icon || undefined}
        data-variant={variant}
        ref={ref}
        /* don't set type when we use `asChild` */
        type={asChild ? undefined : 'button'}
        /* if consumers set type, our default does not set anything, as `rest` contains this */
        {...{ [popoverKey]: popoverVal, ...rest }}
      >
        {loading === true ? (
          <Spinner aria-hidden='true' />
        ) : (
          loading // Allow custom loading spinner
        )}
        <Slottable>{icon && loading ? null : children}</Slottable>
      </Component>
    );
  },
);
