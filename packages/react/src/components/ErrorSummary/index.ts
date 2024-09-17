import { ErrorSummary as ErrorSummaryParent } from './ErrorSummary';
import { ErrorSummaryHeading } from './ErrorSummaryHeading';
import { ErrorSummaryItem } from './ErrorSummaryItem';
import { ErrorSummaryList } from './ErrorSummaryList';

/**
 * @example
 * <ErrorSummary>
 *  <ErrorSummary.Heading>Heading</ErrorSummary.Heading>
 *  <ErrorSummary.List>
 *    <ErrorSummary.Item>Item 1</ErrorSummary.Item>
 *  </ErrorSummary.List>
 * </ErrorSummary>
 */
const ErrorSummary = Object.assign(ErrorSummaryParent, {
  Heading: ErrorSummaryHeading,
  Item: ErrorSummaryItem,
  List: ErrorSummaryList,
});

ErrorSummary.Item.displayName = 'ErrorSummary.Item';
ErrorSummary.Heading.displayName = 'ErrorSummary.Heading';
ErrorSummary.List.displayName = 'ErrorSummary.List';

export type { ErrorSummaryProps } from './ErrorSummary';
export type { ErrorSummaryItemProps } from './ErrorSummaryItem';
export type { ErrorSummaryHeadingProps } from './ErrorSummaryHeading';
export type { ErrorSummaryListProps } from './ErrorSummaryList';
export {
  ErrorSummary,
  ErrorSummaryItem,
  ErrorSummaryHeading,
  ErrorSummaryList,
};
