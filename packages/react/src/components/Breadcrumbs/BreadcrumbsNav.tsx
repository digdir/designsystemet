import cl from 'clsx/lite';
import { type HTMLAttributes, forwardRef } from 'react';

export type BreadcrumbsNavProps = {
  /**
   * Sets the screen reader label for the Breadcrumbs area
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
