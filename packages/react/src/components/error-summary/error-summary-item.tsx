import { forwardRef } from 'react';
import { ListItem, type ListItemProps } from '../list';

export type ErrorSummaryItemProps = ListItemProps;

/**
 * ErrorSummaryItem component, used to display an error link in the ErrorSummary.
 *
 * @example
 * <ErrorSummaryItem>
 *  <ErrorSummaryLink href="#">
 *    Link to error
 *  </ErrorSummaryLink>
 * </ErrorSummaryItem>
 */
export const ErrorSummaryItem = forwardRef<
  HTMLLIElement,
  ErrorSummaryItemProps
>(function ErrorSummaryItem({ ...rest }: ErrorSummaryItemProps, ref) {
  return <ListItem ref={ref} {...rest} />;
});
