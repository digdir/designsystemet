import cl from 'clsx/lite';
import { type HTMLAttributes, forwardRef } from 'react';

export type BreadcrumbsRootProps = {
  /**
   * Sets the size of the component
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
} & HTMLAttributes<HTMLDivElement>;

export const BreadcrumbsRoot = forwardRef<HTMLDivElement, BreadcrumbsRootProps>(
  ({ className, size = 'md', ...rest }, ref) => (
    <div
      ref={ref}
      className={cl('ds-breadcrumbs', `ds-breadcrumbs--${size}`, className)}
      {...rest}
    />
  ),
);

BreadcrumbsRoot.displayName = 'BreadcrumbsRoot';
