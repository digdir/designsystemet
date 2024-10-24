import cl from 'clsx/lite';
import { type HTMLAttributes, forwardRef } from 'react';

export type BreadcrumbsProps = {
  /**
   * Sets the screen reader label for the Breadcrumbs area
   * @default 'Du er her'
   */
  'aria-label'?: string;
} & HTMLAttributes<HTMLElement>;

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ 'aria-label': ariaLabel = 'Du er her:', className, ...rest }, ref) => (
    <nav
      aria-label={ariaLabel}
      className={cl('ds-breadcrumbs', className)}
      ref={ref}
      {...rest}
    />
  ),
);
