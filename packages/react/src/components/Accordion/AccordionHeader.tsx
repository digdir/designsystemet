import { Expand } from '@navikt/ds-icons';
import cn from 'classnames';
import type { MouseEventHandler } from 'react';
import React, { forwardRef, useContext } from 'react';

import { Heading } from '../Typography/Heading';

import styles from './Accordion.module.css';
import { AccordionItemContext } from './AccordionItem';

export interface AccordionHeaderProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * Heading level
   * @default "1"
   */
  level?: '1' | '2' | '3' | '4' | '5' | '6';
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
  ({ level, children, className, onHeaderClick, ...rest }, ref) => {
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
        size='medium'
        level={level}
        className={cn(styles.header, className)}
      >
        <button
          type='button'
          onClick={handleClick}
          aria-expanded={context.open}
        >
          <Heading
            size='medium'
            as='span'
            className={styles.headerContent}
          >
            {children}
          </Heading>
          <Expand
            aria-hidden
            className={styles.expandIcon}
          />
        </button>
      </Heading>
    );
  },
);

export default AccordionHeader;
