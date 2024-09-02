import { forwardRef } from 'react';
import { List, type ListProps } from '../List';

export type ErrorSummaryListProps = Omit<ListProps, 'ref'>;

export const ErrorSummaryList = forwardRef<
  HTMLOListElement,
  ErrorSummaryListProps
>(function ErrorSummaryList({ ...rest }: ErrorSummaryListProps) {
  return <List {...rest} />;
});
