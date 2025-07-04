import { ErrorSummary as ErrorSummaryParent } from './error-summary';
import { ErrorSummaryHeading } from './error-summary-heading';
import { ErrorSummaryItem } from './error-summary-item';
import { ErrorSummaryLink } from './error-summary-link';
import { ErrorSummaryList } from './error-summary-list';

/**
 * ErrorSummary component, used to display a list of errors.
 *
 * @example
 * <ErrorSummary>
 *   <ErrorSummary.Heading>Heading</ErrorSummary.Heading>
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
const ErrorSummary = Object.assign(ErrorSummaryParent, {
  Heading: ErrorSummaryHeading,
  Item: ErrorSummaryItem,
  List: ErrorSummaryList,
  Link: ErrorSummaryLink,
});

ErrorSummary.Item.displayName = 'ErrorSummary.Item';
ErrorSummary.Heading.displayName = 'ErrorSummary.Heading';
ErrorSummary.List.displayName = 'ErrorSummary.List';
ErrorSummary.Link.displayName = 'ErrorSummary.Link';

export type { ErrorSummaryProps } from './error-summary';
export type { ErrorSummaryHeadingProps } from './error-summary-heading';
export type { ErrorSummaryItemProps } from './error-summary-item';
export type { ErrorSummaryLinkProps } from './error-summary-link';
export type { ErrorSummaryListProps } from './error-summary-list';
export {
  ErrorSummary,
  ErrorSummaryItem,
  ErrorSummaryHeading,
  ErrorSummaryList,
  ErrorSummaryLink,
};
