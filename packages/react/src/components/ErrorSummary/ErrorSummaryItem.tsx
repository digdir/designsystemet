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

export type ErrorSummaryItemProps = (RequiredHref | OptionalHref) &
  Omit<ListItemProps, 'asChild'>;

export const ErrorSummaryItem = ({
  href,
  asChild,
  children,
  ...rest
}: ErrorSummaryItemProps) => {
  return (
    <List.Item {...rest}>
      <Link
        href={href}
        asChild={asChild}
      >
        {children}
      </Link>
    </List.Item>
  );
};

ErrorSummaryItem.displayName = 'ErrorSummaryItem';
