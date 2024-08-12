import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { type HTMLAttributes, forwardRef } from 'react';

export type BreadcrumbsNavProps = {
  /** Sets the text label for Breadcrumbs area
   * @default 'Du er her'
   */
  'aria-label'?: string;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLElement>;

export const BreadcrumbsNav = forwardRef<
HTMLElement,
  BreadcrumbsNavProps
>(({
  ['aria-label']: ariaLabel = 'Du er her:',
  asChild,
  className,
  ...rest
}, ref) => {
  const Component = asChild ? Slot : 'nav';

  return (
    <Component
      aria-label={ariaLabel}
      ref={ref}
      className={cl('ds-breadcrumbs__nav', className)}
      {...rest}
    />
  );
});

BreadcrumbsNav.displayName = 'BreadcrumbsNav';
