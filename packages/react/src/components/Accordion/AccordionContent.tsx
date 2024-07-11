import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect, useRef } from 'react';
import { useMergeRefs } from '@floating-ui/react';

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
  const contentRef = useRef<HTMLDivElement>(null);
  const mergedRefs = useMergeRefs([ref, contentRef]);

  useEffect(() => {
    const node = contentRef.current;
    const eventHander = () => {
      context?.toggleOpen();
    };

    if (!node) return;
    if (!context?.open) {
      node?.setAttribute('hidden', 'until-found');
    } else {
      node?.removeAttribute('hidden');
    }

    node?.addEventListener('beforematch', eventHander);

    return () => {
      node?.removeEventListener('beforematch', eventHander);
    };
  }, [context]);

  if (context === null) {
    console.error(
      '<Accordion.Content> has to be used within an <Accordion.Item>',
    );
    return null;
  }

  return (
    <>
      <Paragraph
        asChild
        size='sm'
      >
        <div
          ref={mergedRefs}
          className={cl(
            'ds-accordion__content',
            !context.open && 'ds-accordion__content--closed',
            className,
          )}
          {...rest}
        >
          {children}
        </div>
      </Paragraph>
    </>
  );
});

AccordionContent.displayName = 'AccordionContent';
