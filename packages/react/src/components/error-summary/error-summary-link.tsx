import { forwardRef } from 'react';
import { Link, type LinkProps } from '../link/link';

export type ErrorSummaryLinkProps = LinkProps;

/**
 * Link component used in ErrorSummary.
 */
export const ErrorSummaryLink = forwardRef<
  HTMLAnchorElement,
  ErrorSummaryLinkProps
>(function ErrorSummaryLink({ ...rest }: ErrorSummaryLinkProps, ref) {
  return <Link ref={ref} data-color='neutral' {...rest} />;
});
