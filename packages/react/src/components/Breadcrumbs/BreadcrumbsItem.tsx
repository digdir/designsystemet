import styles from '@digdir/designsystemet-css/breadcrumbs.module.css';
import cl from 'clsx/lite';
import { type HTMLAttributes, forwardRef } from 'react';

export type BreadcrumbsItemProps = HTMLAttributes<HTMLLIElement>;

export const BreadcrumbsItem = forwardRef<HTMLLIElement, BreadcrumbsItemProps>(
  ({ className, ...rest }, ref) => (
    <li
      ref={ref}
      className={cl(styles['ds-breadcrumbs__item'], className)}
      {...rest}
    />
  ),
);

BreadcrumbsItem.displayName = 'BreadcrumbsItem';
