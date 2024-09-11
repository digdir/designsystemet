import { forwardRef, useContext } from 'react';
import { List, type ListUnorderedProps } from '../List';

import { ErrorSummaryContext } from './ErrorSummaryRoot';

export type ErrorSummaryListProps = Omit<ListUnorderedProps, 'ref'>;

export const ErrorSummaryList = forwardRef<
  HTMLOListElement,
  ErrorSummaryListProps
>(function ErrorSummaryList({ ...rest }: ErrorSummaryListProps, ref) {
  const { size } = useContext(ErrorSummaryContext);
  return <List.Unordered size={size} {...rest} ref={ref} />;
});
