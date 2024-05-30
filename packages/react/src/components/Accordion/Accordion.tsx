import type { ReactNode, HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';

import { getColor } from '../../utilities';

type OldColors = 'first' | 'second' | 'third';

export type AccordionProps = {
  /** Accordion background color */
  color?: 'brand1' | 'brand2' | 'brand3' | 'neutral' | 'subtle' | OldColors;
  /** Show border */
  border?: boolean;
  /** Instances of `Accordion.Item` */
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ border = false, className, ...rest }, ref) => {
    const color = getColor(rest.color || 'neutral');

    return (
      <div
        className={cl(
          'fds-accordion',
          border && 'fds-accordion--border',
          color && `fds-accordion--${color}`,
          className,
        )}
        ref={ref}
        {...rest}
      />
    );
  },
);

Accordion.displayName = 'Accordion';
