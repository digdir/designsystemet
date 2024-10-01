import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type AccordionContentProps = HTMLAttributes<HTMLDivElement>;

/**
 * Accordion content component, contains the content of the accordion item.
 * @example
 * <AccordionContent>Content</AccordionContent>
 */
export const AccordionContent = forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(function AccordionContent(rest, ref) {
  return <div ref={ref} {...rest} />;
});
