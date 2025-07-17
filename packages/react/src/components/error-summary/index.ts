import { ErrorSummary as ErrorSummaryParent } from './error-summary';
import { ErrorSummaryHeading } from './error-summary-heading';
import { ErrorSummaryItem } from './error-summary-item';
import { ErrorSummaryLink } from './error-summary-link';
import { ErrorSummaryList } from './error-summary-list';

type ErrorSummary = typeof ErrorSummaryParent & {
  /**
   * ErrorSummary heading component, used to display a heading for the error summary.
   *
   * @example
   * <ErrorSummary>
   *   <ErrorSummary.Heading>Heading</ErrorSummary.Heading>
   * </ErrorSummary>
   */
  Heading: typeof ErrorSummaryHeading;
  /**
   * ErrorSummary.Item component, used to display an error link in the ErrorSummary.
   *
   * @example
   * <ErrorSummary.Item>
   *  <ErrorSummary.Link href="#">
   *    Link to error
   *  </ErrorSummary.Link>
   * </ErrorSummary.Item>
   */
  Item: typeof ErrorSummaryItem;
  /**
   * ErrorSummary link component, used to link to a specific error. Used within an ErrorSummary.Item.
   *
   * @example
   * <ErrorSummary>
   *   <ErrorSummary.Item>
   *     <ErrorSummary.Link href='#'>Error 1</ErrorSummary.Link>
   *   </ErrorSummary.Item>
   * </ErrorSummary>
   */
  Link: typeof ErrorSummaryLink;
  /**
   * ErrorSummary list component, used to display a list of errors.
   *
   * @example
   * <ErrorSummary>
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
  List: typeof ErrorSummaryList;
};

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
const ErrorSummaryComponent: ErrorSummary = Object.assign(ErrorSummaryParent, {
  Heading: ErrorSummaryHeading,
  Item: ErrorSummaryItem,
  List: ErrorSummaryList,
  Link: ErrorSummaryLink,
});

ErrorSummaryComponent.Item.displayName = 'ErrorSummary.Item';
ErrorSummaryComponent.Heading.displayName = 'ErrorSummary.Heading';
ErrorSummaryComponent.List.displayName = 'ErrorSummary.List';
ErrorSummaryComponent.Link.displayName = 'ErrorSummary.Link';

export type { ErrorSummaryProps } from './error-summary';
export type { ErrorSummaryHeadingProps } from './error-summary-heading';
export type { ErrorSummaryItemProps } from './error-summary-item';
export type { ErrorSummaryLinkProps } from './error-summary-link';
export type { ErrorSummaryListProps } from './error-summary-list';
export {
  ErrorSummaryComponent as ErrorSummary,
  ErrorSummaryItem,
  ErrorSummaryHeading,
  ErrorSummaryList,
  ErrorSummaryLink,
};
