import { forwardRef } from 'react';
import { Link, type LinkProps } from '../link/link';

export type BreadcrumbsLinkProps = LinkProps;

export const BreadcrumbsLink = forwardRef<
  HTMLAnchorElement,
  BreadcrumbsLinkProps
>(function BreadcrumbsLink(rest, ref) {
  return <Link ref={ref} {...rest} />;
});
