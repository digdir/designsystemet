import { forwardRef } from 'react';
import type { LinkProps } from '../link';
import { Link } from '../link';

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
