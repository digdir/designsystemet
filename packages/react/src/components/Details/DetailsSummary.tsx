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
  function DetailsSummary({ className, ...rest }, ref) {
    /* Set `className` as `class` so react is happy */
    return <u-summary ref={ref} class={className} {...rest} />;
  },
);
