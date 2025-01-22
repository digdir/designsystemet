import { forwardRef } from 'react';
import type { LinkProps } from '../Link';
import { Link } from '../Link';

export type ErrorSummaryLinkProps = LinkProps;

export const ErrorSummaryLink = forwardRef<
  HTMLAnchorElement,
  ErrorSummaryLinkProps
>(function ErrorSummaryLink({ ...rest }: ErrorSummaryLinkProps, ref) {
  return <Link ref={ref} data-color='neutral' {...rest} />;
});
