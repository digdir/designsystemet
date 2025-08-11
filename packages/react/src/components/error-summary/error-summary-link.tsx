import { forwardRef } from 'react';
import { Link, type LinkProps } from '../link/link';

export type ErrorSummaryLinkProps = LinkProps;

/**
 * ErrorSummary link component, used to link to a specific error. Used within an ErrorSummary.Item.
 *
 * @example
 * <ErrorSummary>
 *   <ErrorSummaryItem>
 *     <ErrorSummaryLink href='#'>Error 1</ErrorSummaryLink>
 *   </ErrorSummaryItem>
 * </ErrorSummary>
 */
export const ErrorSummaryLink = forwardRef<
  HTMLAnchorElement,
  ErrorSummaryLinkProps
>(function ErrorSummaryLink({ ...rest }: ErrorSummaryLinkProps, ref) {
  return <Link ref={ref} data-color='neutral' {...rest} />;
});
