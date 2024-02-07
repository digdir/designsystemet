import type { ListItemProps } from '../List';
import { List } from '../List';
import type { LinkProps } from '../Link';
import { Link } from '../Link';

export type ErrorSummaryItemProps = {
  href: LinkProps['href'];
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & ListItemProps;

export const ErrorSummaryItem = ({
  href,
  asChild,
  children,
  ...rest
}: ErrorSummaryItemProps) => {
  const Component = asChild ? Link : Link;

  return (
    <List.Item {...rest}>
      <Component href={href}>{children}</Component>
    </List.Item>
  );
};

ErrorSummaryItem.displayName = 'ErrorSummary.Item';
