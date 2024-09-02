import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

import { Paragraph } from '..';

export type AccordionHeadingProps = {
  /** Heading text */
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

/**
 * Accordion header component, contains a button to toggle the content.
 * @example
 * <AccordionHeader>Header</AccordionHeader>
 */
export const AccordionHeading = forwardRef<HTMLElement, AccordionHeadingProps>(
  function AccordionHeading(rest, ref) {
    return (
      <Paragraph asChild size='sm'>
        <u-summary ref={ref} {...rest} />
      </Paragraph>
    );
  },
);
