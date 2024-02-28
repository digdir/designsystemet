import { Slot } from '@radix-ui/react-slot';

import type { ListItemProps } from '../List';
import { List } from '../List';
import type { LinkProps } from '../Link';
import { Link } from '../Link';

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

export type ErrorSummaryItemProps =
  | (RequiredHref | OptionalHref) & Omit<ListItemProps, 'asChild'>;

export const ErrorSummaryItem = ({
  href,
  asChild,
  children,
  ...rest
}: ErrorSummaryItemProps) => {
  const Component = asChild ? Slot : Link;

  return (
    <List.Item {...rest}>
      <Component href={href}>{children}</Component>
    </List.Item>
  );
};

ErrorSummaryItem.displayName = 'ErrorSummaryItem';
