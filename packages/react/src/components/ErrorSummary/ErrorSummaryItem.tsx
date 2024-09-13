import { forwardRef } from 'react';
import type { LinkProps } from '../Link';
import { Link } from '../Link';
import type { ListItemProps } from '../List';
import { List } from '../List';

type RequiredHref = {
  href: LinkProps['href'];
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: false;
};

type OptionalHref = {
  href?: LinkProps['href'];
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild: true;
};

export type ErrorSummaryItemProps = (RequiredHref | OptionalHref) &
  Omit<ListItemProps, 'asChild' | 'ref'>;

export const ErrorSummaryItem = forwardRef<
  HTMLLIElement,
  ErrorSummaryItemProps
>(function ErrorSummaryItem(
  { href, asChild, children, ...rest }: ErrorSummaryItemProps,
  ref,
) {
  return (
    <List.Item {...rest} ref={ref}>
      <Link href={href} asChild={asChild}>
        {children}
      </Link>
    </List.Item>
  );
});
