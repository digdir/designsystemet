import styles from '@digdir/designsystemet-css/breadcrumbs.module.css';
import cl from 'clsx/lite';
import { forwardRef, useRef } from 'react';

import { Link } from '../Link';
import type { LinkProps } from '../Link';

export type BreadcrumbsLinkProps = LinkProps;

export const BreadcrumbsLink = forwardRef<
  HTMLAnchorElement,
  BreadcrumbsLinkProps
>(({ className, ...rest }, ref) => (
  <Link
    className={cl(styles[`ds-breadcrumbs__link`], className)}
    ref={ref}
    {...rest}
  />
));

BreadcrumbsLink.displayName = 'BreadcrumbsLink';
