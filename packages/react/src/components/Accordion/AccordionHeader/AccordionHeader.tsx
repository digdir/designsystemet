import { ChevronDownIcon } from '@navikt/aksel-icons';
import cl from 'clsx';
import type { ReactNode, MouseEventHandler, HTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';

import { Paragraph, Heading } from '../..';
import classes from '../Accordion.module.css';
import { AccordionItemContext } from '../AccordionItem';

export type AccordionHeaderProps = {
  /** Heading level. Use this to make sure the heading is correct according to you page heading levels */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Handle when clicked on header */
  onHeaderClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  /** Heading text */
  children: ReactNode;
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

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
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
        className={cl(
          'accordion__button',
          classes.accordionButton,
          `fds-focus`,
        )}
        onClick={handleClick}
        aria-expanded={context.open}
        aria-controls={context.contentId}
      >
        <ChevronDownIcon
          aria-hidden
          className={classes.expandIcon}
          fontSize={'1.5rem'}
        />
        <Paragraph
          asChild
          size='small'
        >
          <span>{children}</span>
        </Paragraph>
      </button>
    </Heading>
  );
});

AccordionHeader.displayName = 'AccordionHeader';
