import { forwardRef } from 'react';
import { List, type ListUnorderedProps } from '../list';

export type ErrorSummaryListProps = ListUnorderedProps;

/**
 * ErrorSummary list component, used to display a list of errors.
 *
 * @example
 * <ErrorSummary>
 *   <ErrorSummary.List>
 *     <ErrorSummary.Item>
 *       <ErrorSummary.Link href='#'>Error 1</ErrorSummary.Link>
 *     </ErrorSummary.Item>
 *     <ErrorSummary.Item>
 *       <ErrorSummary.Link href='#'>Error 2</ErrorSummary.Link>
 *     </ErrorSummary.Item>
 *   </ErrorSummary.List>
 * </ErrorSummary>
 */
export const ErrorSummaryList = forwardRef<
  HTMLOListElement,
  ErrorSummaryListProps
>(function ErrorSummaryList({ ...rest }: ErrorSummaryListProps, ref) {
  return <List.Unordered {...rest} ref={ref} />;
});
