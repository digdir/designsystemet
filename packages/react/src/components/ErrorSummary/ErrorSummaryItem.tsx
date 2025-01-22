import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import type { ListItemProps } from '../List';

export type ErrorSummaryItemProps = ListItemProps;

export const ErrorSummaryItem = forwardRef<
  HTMLLIElement,
  ErrorSummaryItemProps
>(function ErrorSummaryItem({ asChild, ...rest }: ErrorSummaryItemProps, ref) {
  const Component = asChild ? Slot : 'li';

  return <Component {...rest} ref={ref} />;
});
