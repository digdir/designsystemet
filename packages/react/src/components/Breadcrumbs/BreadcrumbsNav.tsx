import styles from '@digdir/designsystemet-css/breadcrumbs.module.css';
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
      className={cl(styles['ds-breadcrumbs__nav'], className)}
      {...rest}
    />
  ),
);

BreadcrumbsNav.displayName = 'BreadcrumbsNav';
