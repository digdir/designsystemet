import cn from 'classnames';
import type { HTMLAttributes } from 'react';
import React, { forwardRef, useContext } from 'react';

import AnimateHeight from '../../utils/AnimateHeight';
import { Paragraph } from '../';

import classes from './Accordion.module.css';
import { AccordionItemContext } from './AccordionItem';

export type AccordionContentProps = HTMLAttributes<HTMLDivElement>;

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
      height={context.open ? 'auto' : 0}
      duration={250}
    >
      <Paragraph
        {...rest}
        as='div'
        size='small'
        ref={ref}
        className={cn(classes.content, className)}
      >
        {children}
      </Paragraph>
    </AnimateHeight>
  );
});
