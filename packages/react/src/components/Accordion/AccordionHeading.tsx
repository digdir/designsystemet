import { ChevronDownIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import type { ReactNode, HTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { Paragraph } from '..';

export type AccordionHeaderProps = {
  /** Heading text */
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

/**
 * Accordion header component, contains a button to toggle the content.
 * @example
 * <AccordionHeader>Header</AccordionHeader>
 */
export const AccordionHeading = forwardRef<HTMLElement, AccordionHeaderProps>(
  ({ children, className, ...rest }, ref) => (
    <u-summary
      ref={ref}
      class={cl('ds-accordion__header ds-focus', className)}
      {...rest}
    >
      <ChevronDownIcon
        aria-hidden
        className='ds-accordion__expand-icon'
        fontSize='1.5rem'
      />
      <Paragraph
        asChild
        size='sm'
      >
        <span>{children}</span>
      </Paragraph>
    </u-summary>
  ),
);

AccordionHeading.displayName = 'AccordionHeading';
