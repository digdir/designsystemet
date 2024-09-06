import { forwardRef } from 'react';
import { List, type ListUnorderedProps } from '../List';

export type ErrorSummaryListProps = Omit<ListUnorderedProps, 'ref'>;

export const ErrorSummaryList = forwardRef<
  HTMLOListElement,
  ErrorSummaryListProps
>(function ErrorSummaryList({ ...rest }: ErrorSummaryListProps, ref) {
  return <List.Unordered {...rest} ref={ref} />;
});
