import type { HTMLAttributes } from 'react';
import React from 'react';

import { ListItem } from '../List';
import type { LinkProps } from '../Link';
import { Link } from '../Link';

type ErrorSummaryItemProps = {
  href: LinkProps['href'];
} & HTMLAttributes<HTMLLIElement>;

export const ErrorSummaryItem = ({
  href,
  children,
  ...rest
}: ErrorSummaryItemProps) => {
  return (
    <ListItem {...rest}>
      <Link href={href}>{children}</Link>
    </ListItem>
  );
};
