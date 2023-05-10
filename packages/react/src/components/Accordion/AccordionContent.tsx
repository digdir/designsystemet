import cl from 'classnames';
import React, { forwardRef, useContext } from 'react';

import AnimateHeight from '../../utils/AnimateHeight';
import { Body } from '../Typography/Body';

import classes from './Accordion.module.css';
import { AccordionItemContext } from './AccordionItem';

export interface AccordionContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Content inside Accordion.Content
   */
  children: React.ReactNode;
}

export type AccordionContentType = React.ForwardRefExoticComponent<
  AccordionContentProps & React.RefAttributes<HTMLDivElement>
>;

const AccordionContent: AccordionContentType = forwardRef(
  ({ children, className, ...rest }, ref) => {
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
        <Body
          {...rest}
          as='div'
          ref={ref}
          className={cl(classes.content, className)}
        >
          {children}
        </Body>
      </AnimateHeight>
    );
  },
);

export default AccordionContent;
