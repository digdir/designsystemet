import { ErrorSummary as ErrorSummaryParent } from './ErrorSummary';
import { ErrorSummaryHeading } from './ErrorSummaryHeading';
import { ErrorSummaryItem } from './ErrorSummaryItem';
import { ErrorSummaryLink } from './ErrorSummaryLink';
import { ErrorSummaryList } from './ErrorSummaryList';

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

export type { ErrorSummaryProps } from './ErrorSummary';
export type { ErrorSummaryItemProps } from './ErrorSummaryItem';
export type { ErrorSummaryHeadingProps } from './ErrorSummaryHeading';
export type { ErrorSummaryListProps } from './ErrorSummaryList';
export type { ErrorSummaryLinkProps } from './ErrorSummaryLink';
export {
  ErrorSummary,
  ErrorSummaryItem,
  ErrorSummaryHeading,
  ErrorSummaryList,
  ErrorSummaryLink,
};
