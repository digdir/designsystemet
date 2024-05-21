import cl from 'clsx';
import type { ReactNode, HTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';

import { AnimateHeight } from '../../../utilities/AnimateHeight';
import { Paragraph } from '../../..';
import { AccordionItemContext } from '../AccordionItem';

export type AccordionContentProps = {
  /** Content inside `Accordion.Content`*/
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

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
          className={cl('fds-accordion__content', className)}
          {...rest}
        >
          {children}
        </div>
      </Paragraph>
    </AnimateHeight>
  );
});

AccordionContent.displayName = 'AccordionContent';
