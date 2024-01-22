import { ChevronDownIcon } from '@navikt/aksel-icons';
import cl from 'clsx';
import type { MouseEventHandler, HTMLAttributes } from 'react';
import React, { forwardRef, useContext } from 'react';

import { Paragraph, Heading } from '../..';
import classes from '../Accordion.module.css';
import utilityClasses from '../../../utilities/utility.module.css';
import { AccordionItemContext } from '../AccordionItem';

export type AccordionHeaderProps = {
  /** Heading level. Use this to make sure the heading is correct according to you page heading levels */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Handle when clicked on header */
  onHeaderClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  /** Heading text */
  children: React.ReactNode;
} & HTMLAttributes<HTMLHeadingElement>;

export const AccordionHeader = forwardRef<
  HTMLHeadingElement,
  AccordionHeaderProps
>(({ level = 1, children, className, onHeaderClick, ...rest }, ref) => {
  const context = useContext(AccordionItemContext);

  if (context === null) {
    console.error(
      '<Accordion.Header> has to be used within an <Accordion.Item>',
    );
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    context.toggleOpen();
    onHeaderClick && onHeaderClick(e);
  };

  return (
    <Heading
      ref={ref}
      size='xsmall'
      level={level}
      className={cl(classes.header, className)}
      {...rest}
    >
      <button
        type='button'
        className={cl(classes.accordionButton, utilityClasses.focusable)}
        onClick={handleClick}
        aria-expanded={context.open}
        aria-controls={context.contentId}
      >
        <ChevronDownIcon
          aria-hidden
          className={classes.expandIcon}
        />
        <Paragraph
          as='span'
          size='small'
        >
          {children}
        </Paragraph>
      </button>
    </Heading>
  );
});
