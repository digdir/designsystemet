import { ChevronDownIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import type { ReactNode, MouseEventHandler, HTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';

import { Paragraph, Heading } from '..';

import { AccordionItemContext } from './AccordionItem';

export type AccordionHeaderProps = {
  /**
   * Heading level. Use this to make sure the heading is correct according to you page heading levels
   * @default 1
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Handle when clicked on header */
  onHeaderClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  /** Heading text */
  children: ReactNode;
} & HTMLAttributes<HTMLHeadingElement>;

/**
 * Accordion header component, contains a button to toggle the content.
 * @example
 * <AccordionHeader>Header</AccordionHeader>
 */
export const AccordionHeading = forwardRef<
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
      size='xs'
      level={level}
      className={cl('ds-accordion__header', className)}
      {...rest}
    >
      <button
        type='button'
        className={cl('ds-accordion__button', `ds-focus`)}
        onClick={handleClick}
        aria-expanded={context.open}
        aria-controls={context.contentId}
      >
        <ChevronDownIcon
          aria-hidden
          className='ds-accordion__expand-icon'
          fontSize={'1.5rem'}
        />
        <Paragraph
          asChild
          size='sm'
        >
          <span>{children}</span>
        </Paragraph>
      </button>
    </Heading>
  );
});

AccordionHeading.displayName = 'AccordionHeading';
