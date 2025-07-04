import { forwardRef } from 'react';
import type { LinkProps } from '../Link';
import { Link } from '../Link';

export type BreadcrumbsLinkProps = LinkProps;

export const BreadcrumbsLink = forwardRef<
  HTMLAnchorElement,
  BreadcrumbsLinkProps
>(function BreadcrumbsLink(rest, ref) {
  return <Link ref={ref} {...rest} />;
});
