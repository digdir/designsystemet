import { forwardRef, useContext } from 'react';
import { List, type ListUnorderedProps } from '../List';

import { ErrorSummaryContext } from './ErrorSummary';

export type ErrorSummaryListProps = ListUnorderedProps;

export const ErrorSummaryList = forwardRef<
  HTMLOListElement,
  ErrorSummaryListProps
>(function ErrorSummaryList({ ...rest }: ErrorSummaryListProps, ref) {
  const { size } = useContext(ErrorSummaryContext);
  return <List.Unordered size={size} {...rest} ref={ref} />;
});
