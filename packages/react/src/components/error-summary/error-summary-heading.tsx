import { forwardRef, useContext, useEffect } from 'react';
import { Heading, type HeadingProps } from '../heading/heading';
import { ErrorSummaryContext } from './error-summary';

export type ErrorSummaryHeadingProps = HeadingProps;

/**
 * ErrorSummary heading component, used to display a heading for the error summary.
 *
 * @example
 * <ErrorSummary>
 *   <ErrorSummaryHeading>Heading</ErrorSummaryHeading>
 * </ErrorSummary>
 */
export const ErrorSummaryHeading = forwardRef<
  HTMLHeadingElement,
  ErrorSummaryHeadingProps
>(function ErrorSummaryHeading(
  { className, id, ...rest }: ErrorSummaryHeadingProps,
  ref,
) {
  const { headingId, setHeadingId } = useContext(ErrorSummaryContext);

  useEffect(() => {
    if (id && headingId !== id) setHeadingId(id);
  }, [headingId, id, setHeadingId]);

  return <Heading id={headingId} ref={ref} {...rest} />;
});
