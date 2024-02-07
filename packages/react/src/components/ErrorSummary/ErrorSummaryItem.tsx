import type { ListItemProps } from '../List';
import { List } from '../List';
import type { LinkProps } from '../Link';
import { Link } from '../Link';

export type ErrorSummaryItemProps = {
  href: LinkProps['href'];
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
