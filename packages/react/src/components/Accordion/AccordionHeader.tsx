import { Expand } from '@navikt/ds-icons';
import cn from 'classnames';
import type { MouseEventHandler } from 'react';
import React, { forwardRef, useContext } from 'react';

import { Heading } from '../Typography/Heading';
import { Text } from '../Typography/Text';

import classes from './Accordion.module.css';
import { AccordionItemContext } from './AccordionItem';

export interface AccordionHeaderProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * Heading level
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Text inside Accordion.Header
   */
  children: React.ReactNode;
  /**
   * Handle when clicked on header
   */
  onHeaderClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

export type AccordionHeaderType = React.ForwardRefExoticComponent<
  AccordionHeaderProps & React.RefAttributes<HTMLHeadingElement>
>;

const AccordionHeader: AccordionHeaderType = forwardRef(
  ({ level = 1, children, className, onHeaderClick, ...rest }, ref) => {
    const context = useContext(AccordionItemContext);

    if (context === null) {
      console.error(
        '<Accordion.Header> has to be used within an <Accordion.Item>',
      );
      return null;
    }

    const handleClick = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      context.toggleOpen();
      onHeaderClick && onHeaderClick(e);
    };

    return (
      <Heading
        {...rest}
        ref={ref}
        size='xsmall'
        level={level}
        className={cn(classes.header, className)}
      >
        <button
          type='button'
          onClick={handleClick}
          aria-expanded={context.open}
          aria-controls={context.contentId}
        >
          <Expand
            aria-hidden
            className={classes.expandIcon}
          />
          <Text
            as='span'
            size='small'
          >
            {children}
          </Text>
        </button>
      </Heading>
    );
  },
);

export default AccordionHeader;
