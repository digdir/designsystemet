import { forwardRef, type HTMLAttributes } from 'react';
import type { DefaultProps } from '../../types';

export type ErrorSummaryHeadingProps = HTMLAttributes<HTMLLegendElement> &
  DefaultProps & {
    /**
     * @deprecated This is not supported anymore, as the heading is rendered as a `legend`
     */
    level?: 1 | 2 | 3 | 4 | 5 | 6;
  };

/**
 * ErrorSummary heading component, used to display a heading for the error summary.
 * Renders a `<legend>`
 *
 * @example
 * <ErrorSummary>
 *   <ErrorSummaryHeading>Heading</ErrorSummaryHeading>
 * </ErrorSummary>
 */
export const ErrorSummaryHeading = forwardRef<
  HTMLLegendElement,
  ErrorSummaryHeadingProps
>(function ErrorSummaryHeading(
  { level: _level, ...rest }: ErrorSummaryHeadingProps,
  ref,
) {
  return (
    <legend
      suppressHydrationWarning // Since @digdir/designsystemet-web adds attributes
      ref={ref}
      {...rest}
    />
  );
});
