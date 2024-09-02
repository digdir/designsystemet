import cl from 'clsx/lite';
import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

import { Paragraph } from '..';

export type AccordionHeadingProps = {
  /** Heading text */
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

/**
 * Accordion header component, contains a button to toggle the content.
 * @example
 * <AccordionHeader>Header</AccordionHeader>
 */
export const AccordionHeading = forwardRef<HTMLElement, AccordionHeadingProps>(
  function AccordionHeading({ className, ...rest }, ref) {
    return (
      <Paragraph asChild size='sm'>
        <u-summary
          class={cl(
            'ds-paragraph ds-paragraph--sm ds-line-height--md', // Very TMP fix awaiting CSS modules
            className,
          )}
          ref={ref}
          {...rest}
        />
      </Paragraph>
    );
  },
);
