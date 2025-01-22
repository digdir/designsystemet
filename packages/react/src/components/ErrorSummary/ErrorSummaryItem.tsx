import { forwardRef } from 'react';
import { ListItem, type ListItemProps } from '../List';

export type ErrorSummaryItemProps = ListItemProps;

export const ErrorSummaryItem = forwardRef<
  HTMLLIElement,
  ErrorSummaryItemProps
>(function ErrorSummaryItem({ ...rest }: ErrorSummaryItemProps, ref) {
  return <ListItem ref={ref} {...rest} />;
});
