import { useMergeRefs } from '@floating-ui/react';
import cl from 'clsx/lite';
import { forwardRef, useRef } from 'react';

import { Link } from '../Link';
import type { LinkProps } from '../Link';

export type BreadcrumbsLinkProps = LinkProps;

export const BreadcrumbsLink = forwardRef<
  HTMLAnchorElement,
  BreadcrumbsLinkProps
>(({ className, ...rest }, ref) => (
  <Link className={cl(`ds-breadcrumbs__link`, className)} ref={ref} {...rest} />
));

BreadcrumbsLink.displayName = 'BreadcrumbsLink';
