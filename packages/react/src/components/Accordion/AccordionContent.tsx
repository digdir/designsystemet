import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect, useRef, useState } from 'react';
import { useMergeRefs } from '@floating-ui/react';

import { Paragraph } from '..';
import { AnimateHeight } from '../../utilities/AnimateHeight';

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
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const context = useContext(AccordionItemContext);
  const contentRef = useRef<HTMLDivElement>(null);
  const mergedRefs = useMergeRefs([ref, contentRef]);

  // Passing `string` to `hidden` in JSX is not currently supported
  // https://github.com/facebook/react/issues/24740
  // The `onbeforematch` event is not supported in JSX either
  useEffect(() => {
    const node = contentRef.current;

    if (!node) return;

    const eventHander = () => {
      context?.toggleOpen();
    };

    if (context?.open) node?.removeAttribute('hidden');

    node?.addEventListener('beforematch', eventHander);

    return () => {
      node?.removeEventListener('beforematch', eventHander);
    };
  }, [context]);

  /* Needed for browsers that does not support "beforematch" */
  if (!('onbeforematch' in document.body) && !hasOpenedOnce) {
    // expand all hidden content
    contentRef.current?.removeAttribute('hidden');
    context?.toggleOpen();
    setHasOpenedOnce(true);
  }

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
      onAnimationFinished={(state) => {
        state === 'closed' &&
          contentRef.current?.setAttribute('hidden', 'until-found');
      }}
    >
      <Paragraph
        asChild
        size='sm'
      >
        <div
          ref={mergedRefs}
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
