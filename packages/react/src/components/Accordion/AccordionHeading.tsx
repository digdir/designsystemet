import { ChevronDownIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { forwardRef, useContext } from 'react';

import { Heading, Paragraph } from '../Typography';

import { AccordionItemContext } from './AccordionItem';

export type AccordionHeadingProps = {
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
 * Accordion heading component, contains a button to toggle the content.
 * @example
 * <AccordionHeading>Header</AccordionHeading>
 */
export const AccordionHeading = forwardRef<
  HTMLHeadingElement,
  AccordionHeadingProps
>(({ level = 1, children, className, onHeaderClick, ...rest }, ref) => {
  const context = useContext(AccordionItemContext);

  if (context === null) {
    console.error(
      '<Accordion.Heading> has to be used within an <Accordion.Item>',
    );
    return null;
  }

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    context.toggleOpen();
    onHeaderClick?.(e);
  };

  return (
    <Heading
      ref={ref}
      size='xs'
      level={level}
      className={cl('ds-accordion__heading', className)}
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
        <Paragraph asChild size='sm'>
          <span>{children}</span>
        </Paragraph>
      </button>
    </Heading>
  );
});

AccordionHeading.displayName = 'AccordionHeading';
