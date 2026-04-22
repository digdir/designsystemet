import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

export type DetailsSummaryProps = {
  /** Heading text */
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

/**
 * Details summary component, contains a the heading to toggle the content.
 *
 * @example
 * <Details.Summary>Heading</Details.Summary>
 */
export const DetailsSummary = forwardRef<HTMLElement, DetailsSummaryProps>(
  function DetailsSummary(rest, ref) {
    return (
      <summary
        suppressHydrationWarning // Since <details> polyfill adds attributes
        ref={ref}
        {...rest}
      />
    );
  },
);
