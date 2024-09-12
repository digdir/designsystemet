import type { ComponentProps } from 'react';
import { List } from '../List';

export type ErrorSummaryListProps = ComponentProps<typeof List.Unordered>;

export default function ErrorSummaryList({ ...rest }: ErrorSummaryListProps) {
  return <List.Unordered {...rest} />;
}

ErrorSummaryList.displayName = 'ErrorSummaryList';
