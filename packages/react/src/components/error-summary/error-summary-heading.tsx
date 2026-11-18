import { forwardRef } from 'react';
import { Heading, type HeadingProps } from '../heading/heading';

export type ErrorSummaryHeadingProps = HeadingProps;

/**
 * ErrorSummary heading component, used to display a heading for the error summary.
 * Renders a `Heading`, which you can also use directly.
 *
 * @example
 * <ErrorSummary>
 *   <ErrorSummaryHeading>Heading</ErrorSummaryHeading>
 * </ErrorSummary>
 */
export const ErrorSummaryHeading = forwardRef<
  HTMLHeadingElement,
  ErrorSummaryHeadingProps
>(function ErrorSummaryHeading(rest: ErrorSummaryHeadingProps, ref) {
  return <Heading ref={ref} {...rest} />;
});
