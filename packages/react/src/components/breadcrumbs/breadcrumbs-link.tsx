import { forwardRef } from 'react';
import type { LinkProps } from '../link';
import { Link } from '../link';

export type BreadcrumbsLinkProps = LinkProps;

export const BreadcrumbsLink = forwardRef<
  HTMLAnchorElement,
  BreadcrumbsLinkProps
>(function BreadcrumbsLink(rest, ref) {
  return <Link ref={ref} {...rest} />;
});
