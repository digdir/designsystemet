import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';

import { AnimateHeight } from '../../utilities/AnimateHeight';
import { Paragraph } from '..';

import { AccordionItemContext } from './AccordionItem';

export type AccordionContentProps = HTMLAttributes<HTMLDivElement>;

/**
 * Accordion content component, contains the content of the accordion item.
 * @example
 * <AccordionContent>Content</AccordionContent>
 */
export const AccordionContent = forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ children, className, ...rest }, ref) => {
  const context = useContext(AccordionItemContext);

  if (context === null) {
    console.error(
      '<Accordion.Content> has to be used within an <Accordion.Item>',
    );
    return null;
  }

  return (
    <AnimateHeight
      id={context.contentId}
      open={context.open}
    >
      <Paragraph
        asChild
        size='sm'
      >
        <div
          ref={ref}
          className={cl('ds-accordion__content', className)}
          {...rest}
        >
          {children}
        </div>
      </Paragraph>
    </AnimateHeight>
  );
});

AccordionContent.displayName = 'AccordionContent';
