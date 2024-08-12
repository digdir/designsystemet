import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { forwardRef } from 'react';

import { Link } from '../Link';
import type { LinkProps } from '../Link';

export type BreadcrumbsLinkProps = LinkProps & {
  mobileLabel?: string;
};

export const BreadcrumbsLink = forwardRef<
  HTMLAnchorElement,
  BreadcrumbsLinkProps
>(({ asChild, className, mobileLabel, ...rest }, ref) => {
  const Component = asChild ? Slot : 'a';

  return (
    <Link asChild>
      <Component
        className={cl(`ds-breadcrumbs__link`, className)}
        ref={ref}
        {...rest}
      />
    </Link>
  );
});

BreadcrumbsLink.displayName = 'BreadcrumbsLink';
