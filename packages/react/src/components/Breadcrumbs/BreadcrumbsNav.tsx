import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { type HTMLAttributes, forwardRef } from 'react';

export type BreadcrumbsNavProps = {
  /** Sets the text label for Breadcrumbs area
   * @default 'Du er her'
   */
  'aria-label'?: string;
} & HTMLAttributes<HTMLElement>;

export const BreadcrumbsNav = forwardRef<HTMLElement, BreadcrumbsNavProps>(
  ({ 'aria-label': ariaLabel = 'Du er her:', className, ...rest }, ref) => (
    <nav
      aria-label={ariaLabel}
      ref={ref}
      className={cl('ds-breadcrumbs__nav', className)}
      {...rest}
    />
  ),
);

BreadcrumbsNav.displayName = 'BreadcrumbsNav';
