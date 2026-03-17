import { forwardRef } from 'react';
import { Link, type LinkProps } from '../link/link';

export type BreadcrumbsLinkProps = LinkProps;

export const BreadcrumbsLink = forwardRef<
  HTMLAnchorElement,
  BreadcrumbsLinkProps
>(function BreadcrumbsLink(rest, ref) {
  return (
    <Link
      suppressHydrationWarning // Since <ds-breadcrumbs> adds aria-current="page"
      ref={ref}
      {...rest}
    />
  );
});
