import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { Paragraph } from '..';

export type AccordionContentProps = HTMLAttributes<HTMLDivElement>;

/**
 * Accordion content component, contains the content of the accordion item.
 * @example
 * <AccordionContent>Content</AccordionContent>
 */
export const AccordionContent = forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ className, ...rest }, ref) => {
  return (
    <Paragraph
      asChild
      size='sm'
    >
      <div
        ref={ref}
        className={cl('ds-accordion__content', className)}
        {...rest}
      />
    </Paragraph>
  );
});

AccordionContent.displayName = 'AccordionContent';
