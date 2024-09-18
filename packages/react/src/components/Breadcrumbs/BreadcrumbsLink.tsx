import { forwardRef } from 'react';

import { Link } from '../Link';
import type { LinkProps } from '../Link';

export type BreadcrumbsLinkProps = LinkProps;

export const BreadcrumbsLink = forwardRef<
  HTMLAnchorElement,
  BreadcrumbsLinkProps
>(function BreadcrumbsLink(rest, ref) {
  return <Link ref={ref} {...rest} />;
});
