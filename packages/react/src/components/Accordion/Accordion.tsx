import cl from 'clsx/lite';
import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import type { Color } from '../../colors';
import type { DefaultProps } from '../../types';
import type { Merge } from '../../utilities';

export type AccordionProps = Merge<
  DefaultProps & HTMLAttributes<HTMLDivElement>,
  {
    /**
     * Accordion background color. Unlike most components, data-color must be specified
     * on this element to hava an effect. Otherwise the default is used.
     * @default neutral
     */
    'data-color'?: 'subtle' | Color;
    /**
     * Show border
     * @default false
     **/
    border?: boolean;
    /** Instances of `Accordion.Item` */
    children: ReactNode;
  }
>;

/**
 * Accordion component, contains `Accordion.Item` components.
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion(
    { border = false, 'data-color': color = 'neutral', className, ...rest },
    ref,
  ) {
    return (
      <div
        className={cl('ds-accordion-group', className)}
        data-border={border || undefined} /* Fallback to  */
        data-color={color}
        ref={ref}
        {...rest}
      />
    );
  },
);
