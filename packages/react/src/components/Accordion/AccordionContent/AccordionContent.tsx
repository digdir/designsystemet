import cl from 'clsx';
import type { HTMLAttributes } from 'react';
import React, { forwardRef, useContext } from 'react';

import { AnimateHeight } from '../../../utilities/AnimateHeight';
import { Paragraph } from '../../..';
import classes from '../Accordion.module.css';
import { AccordionItemContext } from '../AccordionItem';

export type AccordionContentProps = {
  /** Content inside `Accordion.Content`*/
  children: React.ReactNode;
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
        as='div'
        size='small'
        ref={ref}
        className={cl(classes.content, className)}
        {...rest}
      >
        {children}
      </Paragraph>
    </AnimateHeight>
  );
});
