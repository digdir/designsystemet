import { forwardRef } from 'react';
import { ListItem, type ListItemProps } from '../List';

export type ErrorSummaryItemProps = ListItemProps;

/**
 * ErrorSummaryItem component, used to display an error link in the ErrorSummary.
 *
 * @example
 * <ErrorSummary.Item href='#'>Link to error</ErrorSummary.Item>
 */
export const ErrorSummaryItem = forwardRef<
  HTMLLIElement,
  ErrorSummaryItemProps
>(function ErrorSummaryItem({ ...rest }: ErrorSummaryItemProps, ref) {
  return <ListItem ref={ref} {...rest} />;
});
