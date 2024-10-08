import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

export type AccordionHeadingProps = {
  /** Heading text */
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

/**
 * Accordion heading component, contains a button to toggle the content.
 * @example
 * <AccordionHeading>Heading</AccordionHeading>
 */
export const AccordionHeading = forwardRef<HTMLElement, AccordionHeadingProps>(
  function AccordionHeading({ className, ...rest }, ref) {
    /* Set `className` as `class` so react is happy */
    return <u-summary ref={ref} class={className} {...rest} />;
  },
);
